from decimal import Decimal
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Count, Q
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from django.utils import timezone
import razorpay
import uuid
import hmac
import hashlib

from .serializers import *
from .models import *


# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-is_featured', 'order', '-created_at')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'is_featured']
    search_fields = ['title', 'short_description', 'description', 'tech_stack']
    ordering_fields = ['created_at', 'completion_date', 'order']
    serializer_class = ProjectListSerializer
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectSerializer
        return ProjectListSerializer

    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        project = self.get_object()
        related = Project.objects.filter(
            category=project.category
        ).exclude(id=project.id)[:4]
        serializer = ProjectListSerializer(related, many=True, context={'request': request})
        return Response(serializer.data)


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer

    def get_serializer_context(self):
        return {'request': self.request}


class TechStackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TechStack.objects.filter(is_active=True)
    serializer_class = TechStackSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category']

    def get_serializer_context(self):
        return {'request': self.request}


class StatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stat.objects.all()
    serializer_class = StatSerializer


class ProjectStatsView(APIView):
    def get(self, request):
        stats = {
            'total_projects': Project.objects.count(),
            'live_projects': Project.objects.filter(status='live').count(),
            'completed_projects': Project.objects.filter(status='completed').count(),
            'featured_projects': Project.objects.filter(is_featured=True).count(),
            'total_technologies': TechStack.objects.count(),
            'total_categories': len(set(Project.objects.values_list('category', flat=True))),
        }
        return Response(stats)


class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Technology.objects.filter(is_active=True)
    serializer_class = TechnologySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'subcategory']
    search_fields = ['name', 'category', 'subcategory', 'description']
    ordering_fields = ['name', 'popularity', 'order', 'category']
    ordering = ['category', 'subcategory', 'name']
    lookup_field = 'slug'
    

class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_featured', 'is_available']
    search_fields = ['name', 'role', 'skills', 'bio']
    ordering_fields = ['order', 'name', 'experience_years', 'rating']
    ordering = ['order', '-is_featured', 'name']
    lookup_field = 'slug'


class MeetingRequestViewSet(viewsets.ModelViewSet):
    queryset = MeetingRequest.objects.all()
    serializer_class = MeetingRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'service']
    search_fields = ['full_name', 'email', 'phone', 'company']
    ordering_fields = ['created_at', 'preferred_date']
    ordering = ['-created_at']
    
    def create(self, request, *args, **kwargs):
        ip = request.META.get('REMOTE_ADDR')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(ip_address=ip)
        
        try:
            send_mail(
                subject=f"[GrowUp] New Meeting Request from {request.data.get('full_name')}",
                message=f"""
New meeting request received on GrowUp website.

Client Details:
----------------
Name: {request.data.get('full_name')}
Email: {request.data.get('email')}
Phone: {request.data.get('phone')}
Company: {request.data.get('company', 'N/A')}

Meeting Details:
----------------
Service: {dict(MeetingRequest.SERVICE_CHOICES).get(request.data.get('service'), request.data.get('service'))}
Budget: {request.data.get('budget', 'Not specified')}
Preferred Date: {request.data.get('preferred_date')}
Preferred Time: {request.data.get('preferred_time')}

Message:
--------
{request.data.get('message')}

IP Address: {ip}

Please login to admin panel to manage this request.
                """.strip(),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass
        
        return Response(
            {
                'success': True,
                'message': 'Meeting request submitted successfully! We will contact you soon.',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class ProblemPostViewSet(viewsets.ModelViewSet):
    queryset = ProblemPost.objects.all()
    serializer_class = ProblemPostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title', 'description', 'user_name']
    
    def create(self, request, *args, **kwargs):
        attachments = []
        if request.FILES:
            for file in request.FILES.getlist('attachments'):
                attachments.append({
                    'name': file.name,
                    'url': f'/media/problems/{file.name}'
                })
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(attachments=attachments)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        problem = self.get_object()
        serializer = ProblemMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(problem=problem)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def add_offer(self, request, pk=None):
        problem = self.get_object()
        serializer = ProblemOfferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(problem=problem)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def accept_offer(self, request, pk=None):
        problem = self.get_object()
        offer_id = request.data.get('offer_id')
        
        try:
            offer = ProblemOffer.objects.get(id=offer_id, problem=problem)
            offer.status = 'accepted'
            offer.save()
            
            problem.assigned_to = offer.developer
            problem.status = 'assigned'
            problem.save()
            
            ProblemMessage.objects.create(
                problem=problem,
                sender_name='System',
                sender_email='system@growup.com',
                sender_type='developer',
                message=f"Offer from {offer.developer.name} has been accepted. They will start working on your problem soon."
            )
            
            return Response({'success': True, 'message': 'Offer accepted successfully'})
        except ProblemOffer.DoesNotExist:
            return Response({'error': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)


class ProjectRequestViewSet(viewsets.ModelViewSet):
    queryset = ProjectRequest.objects.all()
    serializer_class = ProjectRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'project_type']
    search_fields = ['full_name', 'email', 'developer_name']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def create(self, request, *args, **kwargs):
        ip = request.META.get('REMOTE_ADDR')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(ip_address=ip)
        return Response(
            {'success': True, 'message': 'Project request submitted successfully!'},
            status=status.HTTP_201_CREATED
        )


class ProblemRequestViewSet(viewsets.ModelViewSet):
    queryset = ProblemRequest.objects.all()
    serializer_class = ProblemRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'problem_category', 'urgency']
    search_fields = ['full_name', 'email', 'problem_title', 'problem_description']
    ordering_fields = ['created_at']
    ordering = ['-created_at']


class JobCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    lookup_field = 'slug'


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'employment_type', 'experience_level', 'is_featured', 'is_remote']
    search_fields = ['title', 'description', 'requirements', 'required_skills']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']
    ordering = ['-is_featured', '-created_at']
    lookup_field = 'slug'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'job__slug']
    search_fields = ['full_name', 'email', 'skills']
    ordering = ['-applied_at']
    
    def create(self, request, *args, **kwargs):
        ip = request.META.get('REMOTE_ADDR')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if already applied
        job_id = request.data.get('job')
        email = request.data.get('email')
        
        existing = JobApplication.objects.filter(job_id=job_id, email=email).first()
        if existing:
            return Response(
                {'error': 'You have already applied for this position'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save(ip_address=ip)
        
        # Update job applications count
        job = serializer.validated_data['job']
        job.applications_count += 1
        job.save(update_fields=['applications_count'])
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def track(self, request):
        """Track applications by email"""
        email = request.query_params.get('email')
        if not email:
            return Response(
                {'error': 'Email parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        applications = JobApplication.objects.filter(email=email).select_related('job')
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        interview_date = request.data.get('interview_date')
        interview_link = request.data.get('interview_link')
        interview_notes = request.data.get('interview_notes')
        admin_notes = request.data.get('admin_notes')
        
        if new_status and new_status in dict(JobApplication.STATUS_CHOICES):
            application.status = new_status
        
        if interview_date:
            application.interview_date = interview_date
        if interview_link:
            application.interview_link = interview_link
        if interview_notes:
            application.interview_notes = interview_notes
        if admin_notes:
            application.admin_notes = admin_notes
        
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)


class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    ordering = ['order', 'price']


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'plan__plan_type', 'payment_status']
    search_fields = ['user_name', 'user_email', 'subscription_id']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SubscriptionCreateSerializer
        return SubscriptionSerializer
    
    @action(detail=False, methods=['post'], url_path='initiate_payment')
    def initiate_payment(self, request):
        """Initiate Razorpay payment for subscription"""
        subscription_id = request.data.get('subscription_id')
        
        print("=" * 50)
        print("INITIATE PAYMENT CALLED")
        print(f"Subscription ID: {subscription_id}")
        print(f"RAZORPAY_KEY_ID: {settings.RAZORPAY_KEY_ID}")
        print("=" * 50)
        
        if not subscription_id:
            return Response({'error': 'Subscription ID required'}, status=400)
        
        try:
            subscription = Subscription.objects.get(id=subscription_id)
            
            # Calculate amount
            if subscription.plan.billing_cycle == 'yearly':
                amount = float(subscription.plan.price) * 12 * 0.8
            else:
                amount = float(subscription.plan.price)
            
            # Check if Razorpay keys are configured
            if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
                print("ERROR: Razorpay keys are missing!")
                return Response({
                    'error': 'Payment gateway not configured. Please contact support.'
                }, status=400)
            
            # Create Razorpay order
            amount_in_paise = int(amount * 100)
            
            # Initialize Razorpay client
            import razorpay
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            
            order_data = {
                'amount': amount_in_paise,
                'currency': 'INR',
                'payment_capture': 1,
                'receipt': f"sub_{subscription.subscription_id}",
                'notes': {
                    'subscription_id': str(subscription.id),
                    'user_email': subscription.user_email,
                    'plan': subscription.plan.name
                }
            }
            
            print(f"Creating order with amount: {amount_in_paise} paise (₹{amount})")
            
            try:
                order = client.order.create(data=order_data)
                print(f"✅ Order created successfully: {order['id']}")
                
                # Save order ID to subscription
                subscription.razorpay_order_id = order['id']
                subscription.payment_amount = amount
                subscription.save()
                
                return Response({
                    'success': True,
                    'order_id': order['id'],
                    'amount': amount,
                    'key_id': settings.RAZORPAY_KEY_ID,
                    'subscription_id': subscription.id
                })
            except Exception as e:
                print(f"❌ Razorpay API error: {str(e)}")
                return Response({
                    'success': False,
                    'error': f'Razorpay error: {str(e)}'
                }, status=400)
                
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found'}, status=404)
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return Response({'error': str(e)}, status=400)
    
    @action(detail=True, methods=['get'])
    def payment_details(self, request, pk=None):
        """Get payment details for a subscription"""
        subscription = self.get_object()
        
        # Get the payment transaction
        transaction = PaymentTransaction.objects.filter(
            invoice__subscription=subscription
        ).first()
        
        payment_data = {
            'transaction_id': transaction.transaction_id if transaction else None,
            'razorpay_order_id': subscription.razorpay_order_id,
            'razorpay_payment_id': subscription.razorpay_payment_id,
            'amount': subscription.payment_amount or subscription.plan.price,
            'payment_method': 'Razorpay' if subscription.razorpay_payment_id else 'Manual UPI',
            'status': subscription.payment_status,
            'created_at': subscription.created_at,
            'verified_at': subscription.payment_verified_at,
            'verified_by': subscription.payment_verified_by
        }
        
        return Response(payment_data)
    
    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        """Verify Razorpay payment signature"""
        order_id = request.data.get('razorpay_order_id')
        payment_id = request.data.get('razorpay_payment_id')
        signature = request.data.get('razorpay_signature')
        subscription_id = request.data.get('subscription_id')
        
        if not all([order_id, payment_id, signature, subscription_id]):
            return Response({'error': 'Missing payment details'}, status=400)
        
        try:
            # Verify signature
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            
            razorpay_client.utility.verify_payment_signature(params_dict)
            
            # Update subscription
            subscription = Subscription.objects.get(id=subscription_id)
            subscription.razorpay_payment_id = payment_id
            subscription.razorpay_signature = signature
            subscription.payment_status = 'verified'
            subscription.status = 'pending_approval'
            subscription.save()
            
            # Notify admin
            try:
                send_mail(
                    subject=f"💰 Payment Received - {subscription.subscription_id}",
                    message=f"""
Payment received for subscription.

User: {subscription.user_name}
Email: {subscription.user_email}
Plan: {subscription.plan.name}
Amount: ₹{subscription.payment_amount}
Payment ID: {payment_id}

Please login to admin panel to verify and activate the subscription.
                    """,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.ADMIN_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass
            
            return Response({
                'success': True,
                'message': 'Payment verified successfully'
            })
            
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found'}, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'error': 'Payment verification failed'
            }, status=400)
    
    @action(detail=True, methods=['post'])
    def submit_manual_payment_proof(self, request, pk=None):
        """Submit manual UPI payment proof"""
        subscription = self.get_object()
        
        transaction_id = request.data.get('transaction_id')
        upi_id = request.data.get('upi_id')
        payment_screenshot = request.FILES.get('payment_screenshot')
        
        if not transaction_id:
            return Response({'error': 'Transaction ID required'}, status=400)
        
        if not payment_screenshot:
            return Response({'error': 'Payment screenshot required'}, status=400)
        
        # Save payment proof
        subscription.payment_proof = payment_screenshot
        subscription.payment_status = 'pending'
        subscription.status = 'pending_approval'
        subscription.admin_notes = f"Transaction ID: {transaction_id}, UPI ID: {upi_id}"
        subscription.save()
        
        # Notify admin
        try:
            send_mail(
                subject=f"📱 Manual Payment Proof Uploaded - {subscription.subscription_id}",
                message=f"""
Manual payment proof uploaded for verification.

User Details:
- Name: {subscription.user_name}
- Email: {subscription.user_email}
- Plan: {subscription.plan.name}
- Amount: ₹{subscription.plan.price}

Payment Details:
- Transaction ID: {transaction_id}
- UPI ID: {upi_id}

Please login to admin panel to verify and approve this payment.
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass
        
        return Response({
            'success': True,
            'message': 'Payment proof submitted. Admin will verify within 24 hours.'
        })
    
    @action(detail=True, methods=['post'])
    def admin_approve_payment(self, request, pk=None):
        """Admin approve payment and activate subscription"""
        subscription = self.get_object()
        
        # Update subscription
        subscription.status = 'active'
        subscription.payment_status = 'verified'
        subscription.payment_verified_at = datetime.now()
        subscription.payment_verified_by = request.user.username
        subscription.approved_at = datetime.now()
        subscription.approved_by = request.user.username
        subscription.save()
        
        # Update invoice
        invoice = subscription.invoices.first()
        if invoice:
            invoice.status = 'paid'
            invoice.paid_date = datetime.now()
            invoice.save()
        
        # Send activation email to user
        try:
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ padding: 30px; background: #f9f9f9; }}
                    .feature {{ padding: 10px 0; border-bottom: 1px solid #eee; }}
                    .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
                    .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Premium Plan Activated!</h1>
                    </div>
                    <div class="content">
                        <h2>Dear {subscription.user_name},</h2>
                        <p>Great news! Your <strong>{subscription.plan.name}</strong> premium plan has been activated successfully.</p>
                        
                        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3>📋 Plan Details:</h3>
                            <p><strong>Plan:</strong> {subscription.plan.name}</p>
                            <p><strong>Start Date:</strong> {subscription.start_date.strftime('%B %d, %Y')}</p>
                            <p><strong>End Date:</strong> {subscription.end_date.strftime('%B %d, %Y')}</p>
                            
                            <h3>✨ Features Included:</h3>
                            <ul>
            """
            
            for feature in subscription.plan.features:
                html_message += f"<li>✓ {feature}</li>"
            
            html_message += f"""
                            </ul>
                        </div>
                        
                        <p>You can now access all premium features. Click the button below to get started:</p>
                        
                        <div style="text-align: center;">
                            <a href="http://localhost:5173/dashboard" class="button">Go to Dashboard</a>
                        </div>
                        
                        <p>If you have any questions, please contact our support team at <a href="mailto:{settings.CONTACT_EMAIL}">{settings.CONTACT_EMAIL}</a>.</p>
                        
                        <p>Thank you for choosing GrowUp!</p>
                        
                        <p>Best regards,<br>
                        <strong>GrowUp Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2024 GrowUp. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            send_mail(
                subject=f"🎉 Premium Plan Activated - {subscription.plan.name}",
                message=strip_tags(html_message),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[subscription.user_email],
                html_message=html_message,
                fail_silently=False,
            )
            
            subscription.activation_email_sent = True
            subscription.save()
            
        except Exception as e:
            print(f"Email sending failed: {e}")
        
        # Notify admin
        try:
            send_mail(
                subject=f"✅ Subscription Approved - {subscription.subscription_id}",
                message=f"""
Subscription has been approved and activated.

User: {subscription.user_name}
Email: {subscription.user_email}
Plan: {subscription.plan.name}
Amount: ₹{subscription.plan.price}

Premium features are now available to the user.
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass
        
        return Response({
            'success': True,
            'message': 'Subscription approved and activated. Email sent to user.'
        })
    
    @action(detail=True, methods=['post'])
    def admin_reject_payment(self, request, pk=None):
        """Admin reject payment"""
        subscription = self.get_object()
        
        reason = request.data.get('reason', 'Payment verification failed')
        
        subscription.status = 'cancelled'
        subscription.payment_status = 'failed'
        subscription.admin_notes = reason
        subscription.save()
        
        # Send rejection email
        try:
            send_mail(
                subject=f"Payment Verification Failed - {subscription.plan.name}",
                message=f"""
Dear {subscription.user_name},

We regret to inform you that your payment verification for the {subscription.plan.name} plan has failed.

Reason: {reason}

Please contact our support team at {settings.CONTACT_EMAIL} for assistance or try again with a new subscription.

Best regards,
GrowUp Team
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[subscription.user_email],
                fail_silently=False,
            )
        except Exception:
            pass
        
        return Response({
            'success': True,
            'message': 'Payment rejected'
        })
    
    @action(detail=False, methods=['get'])
    def check_premium_access(self, request):
        """Check if user has premium access"""
        user_email = request.query_params.get('email')
        
        if not user_email:
            return Response(
                {'has_premium': False, 'message': 'Email required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        subscription = Subscription.objects.filter(
            user_email=user_email,
            status='active',
            payment_status='verified',
            end_date__gte=datetime.now()
        ).first()
        
        if subscription:
            return Response({
                'has_premium': True,
                'plan': subscription.plan.name,
                'plan_type': subscription.plan.plan_type,
                'expires_at': subscription.end_date,
                'features': subscription.plan.features,
                'max_projects': subscription.plan.max_projects,
                'max_team_members': subscription.plan.max_team_members,
                'storage_gb': subscription.plan.storage_gb,
                'support_priority': subscription.plan.support_priority,
                'api_access': subscription.plan.api_access,
                'custom_branding': subscription.plan.custom_branding,
                'analytics': subscription.plan.analytics
            })
        else:
            return Response({
                'has_premium': False,
                'message': 'No active premium subscription found'
            })
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                subscription = serializer.save()
                
                # Send notification to admin
                try:
                    send_mail(
                        subject=f"New Subscription Request - {subscription.subscription_id}",
                        message=f"""
New subscription request received.

Customer Details:
- Name: {subscription.user_name}
- Email: {subscription.user_email}
- Phone: {request.data.get('user_phone', 'N/A')}
- Company: {request.data.get('company', 'N/A')}
- Plan: {subscription.plan.name}
- Billing Cycle: {request.data.get('billing_cycle', 'monthly')}
- Subscription ID: {subscription.subscription_id}

Please login to admin panel to manage this subscription.
                        """,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[settings.ADMIN_EMAIL],
                        fail_silently=True,
                    )
                except Exception as e:
                    print(f"Admin notification failed: {e}")
                
                return Response({
                    'success': True,
                    'message': 'Subscription created successfully. Please complete payment.',
                    'data': SubscriptionSerializer(subscription, context={'request': request}).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("Serializer errors:", serializer.errors)
            return Response({
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                subscription = serializer.save()
                
                # Send notification to admin
                try:
                    send_mail(
                        subject=f"New Subscription Request - {subscription.subscription_id}",
                        message=f"""
New subscription request received.

Customer Details:
- Name: {subscription.user_name}
- Email: {subscription.user_email}
- Plan: {subscription.plan.name}
- Subscription ID: {subscription.subscription_id}

Please login to admin panel to verify payment and activate subscription.
                        """,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[settings.ADMIN_EMAIL],
                        fail_silently=True,
                    )
                except Exception:
                    pass
                
                return Response({
                    'success': True,
                    'message': 'Subscription request submitted. Please complete payment to activate.',
                    'data': SubscriptionSerializer(subscription, context={'request': request}).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("Serializer errors:", serializer.errors)
            return Response({
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'payment_method']
    search_fields = ['customer_name', 'customer_email', 'invoice_number']


class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']


class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['payment_type', 'is_default']
    search_fields = ['user_email', 'card_last4', 'upi_id']
    
    def create(self, request, *args, **kwargs):
        user_email = request.data.get('user_email')
        
        # If this is the first payment method for this email, make it default
        if not PaymentMethod.objects.filter(user_email=user_email).exists():
            request.data['is_default'] = True
        
        # If setting as default, remove default from others
        if request.data.get('is_default'):
            PaymentMethod.objects.filter(user_email=user_email).update(is_default=False)
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        payment_method = self.get_object()
        user_email = payment_method.user_email
        
        # Remove default from all other payment methods for this user
        PaymentMethod.objects.filter(user_email=user_email).update(is_default=False)
        
        # Set this as default
        payment_method.is_default = True
        payment_method.save()
        
        return Response({'success': True, 'message': 'Default payment method updated'})
    
    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        payment_method = self.get_object()
        user_email = payment_method.user_email
        
        # Don't allow deleting the only payment method
        if PaymentMethod.objects.filter(user_email=user_email).count() <= 1:
            return Response(
                {'error': 'Cannot delete the only payment method. Add another payment method first.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If deleting the default, make another payment method default
        if payment_method.is_default:
            another_method = PaymentMethod.objects.filter(
                user_email=user_email
            ).exclude(id=payment_method.id).first()
            if another_method:
                another_method.is_default = True
                another_method.save()
        
        payment_method.delete()
        return Response({'success': True, 'message': 'Payment method removed'})


class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            ip = request.META.get('REMOTE_ADDR')
            instance = serializer.save(ip_address=ip)

            try:
                send_mail(
                    subject=f"[GrowUp] New Contact: {instance.subject}",
                    message=f"""
New contact message received on GrowUp website.

From: {instance.name} ({instance.email})
Company: {instance.company or 'N/A'}
Phone: {instance.phone or 'N/A'}
Service: {instance.get_service_display()}
Budget: {instance.budget or 'N/A'}

Subject: {instance.subject}

Message:
{instance.message}
                    """.strip(),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass

            return Response(
                {
                    'success': True,
                    'message': "Thank you! We'll get back to you within 24 hours.",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(['GET'])
def api_overview(request):
    return Response({
        'name': 'GrowUp API',
        'version': '2.0.0',
        'endpoints': {
            'services': '/api/services/',
            'projects': '/api/projects/',
            'projects_detail': '/api/projects/{slug}/',
            'projects_related': '/api/projects/{slug}/related/',
            'projects_stats': '/api/projects/stats/',
            'testimonials': '/api/testimonials/',
            'tech_stack': '/api/tech-stack/',
            'stats': '/api/stats/',
            'technologies': '/api/technologies/',
            'team_members': '/api/team-members/',
            'meeting_requests': '/api/meeting-requests/',
            'project_requests': '/api/project-requests/',
            'problem_requests': '/api/problem-requests/',
            'problems': '/api/problems/',
            'jobs': '/api/jobs/',
            'job_applications': '/api/job-applications/',
            'job_applications_track': '/api/job-applications/track/?email=your@email.com',
            'subscription_plans': '/api/subscription-plans/',
            'subscriptions': '/api/subscriptions/',
            'invoices': '/api/invoices/',
            'payment_methods': '/api/payment-methods/',
            'contact': '/api/contact/ [POST]',
        },
    })
    
    
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserUpdateSerializer
from .models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    print("=== REGISTRATION REQUEST RECEIVED ===")
    print("Request data:", request.data)
    
    # Handle multipart form data (for file uploads)
    data = {}
    for key, value in request.data.items():
        data[key] = value
    
    # Handle profile photo if present
    if 'profile_photo' in request.FILES:
        data['profile_photo'] = request.FILES['profile_photo']
    
    serializer = UserRegistrationSerializer(data=data)
    
    if serializer.is_valid():
        try:
            # Create user with hashed password
            user_data = serializer.validated_data
            user_data['password'] = make_password(user_data['password'])
            user = User.objects.create(**user_data)
            
            print(f"User created successfully: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Registration successful! Please login.',
                'user': UserProfileSerializer(user, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return Response({
                'success': False,
                'errors': {'non_field_errors': [str(e)]}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        print("Serializer errors:", serializer.errors)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    print("=== LOGIN REQUEST RECEIVED ===")
    print("Request data:", request.data)
    
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Login the user
        login(request, user)
        
        # Store user info in session
        request.session['user_id'] = user.id
        request.session['user_email'] = user.email
        
        print(f"User logged in: {user.email}")
        
        return Response({
            'success': True,
            'message': 'Login successful!',
            'user': UserProfileSerializer(user, context={'request': request}).data
        }, status=status.HTTP_200_OK)
    
    print("Login errors:", serializer.errors)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)
    return Response({
        'success': True,
        'message': 'Logged out successfully'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserProfileSerializer(request.user, context={'request': request})
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': UserProfileSerializer(request.user, context={'request': request}).data
        })
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_photo(request):
    if 'profile_photo' not in request.FILES:
        return Response({'error': 'No file provided'}, status=400)
    
    request.user.profile_photo = request.FILES['profile_photo']
    request.user.save()
    
    return Response({
        'success': True,
        'message': 'Profile photo uploaded',
        'photo_url': request.user.get_profile_photo_url()
    })