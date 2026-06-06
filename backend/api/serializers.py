from rest_framework import serializers
from .models import *


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'category', 'description', 'icon', 'features', 'order']


class ProjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ['id', 'image_url', 'caption', 'order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ProjectListSerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()
    tech_stack_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'category',
            'tech_stack_list', 'featured_image_url', 'status', 
            'is_featured', 'live_url', 'completion_date',
            'client_name', 'client_review', 'client_rating'
        ]

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        return None

    def get_tech_stack_list(self, obj):
        if isinstance(obj.tech_stack, list):
            return obj.tech_stack[:4] if obj.tech_stack else []
        return []


class ProjectSerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()
    images = ProjectImageSerializer(many=True, read_only=True)
    tech_stack_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        return None

    def get_tech_stack_list(self, obj):
        if isinstance(obj.tech_stack, list):
            return obj.tech_stack
        return []


class TestimonialSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'client_role', 'client_company', 'avatar_url', 'message', 'rating']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name', 'slug', 'category', 'subcategory', 'icon', 'description', 'long_description', 'popularity', 'order']


class TeamMemberSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = TeamMember
        fields = '__all__'
    
    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and request:
            return request.build_absolute_uri(obj.profile_image.url)
        return None
    
    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None


class MeetingRequestSerializer(serializers.ModelSerializer):
    service_display = serializers.CharField(source='get_service_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = MeetingRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'ip_address']
        

class ProjectRequestSerializer(serializers.ModelSerializer):
    project_type_display = serializers.CharField(source='get_project_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ProjectRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'ip_address']


class ProblemMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemMessage
        fields = '__all__'
        read_only_fields = ['created_at']


class ProblemOfferSerializer(serializers.ModelSerializer):
    developer_details = TeamMemberSerializer(source='developer', read_only=True)
    
    class Meta:
        model = ProblemOffer
        fields = '__all__'
        read_only_fields = ['created_at']


class ProblemPostSerializer(serializers.ModelSerializer):
    messages = ProblemMessageSerializer(many=True, read_only=True)
    offers = ProblemOfferSerializer(many=True, read_only=True)
    assigned_to_details = TeamMemberSerializer(source='assigned_to', read_only=True)
    
    class Meta:
        model = ProblemPost
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ProblemRequestSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_problem_category_display', read_only=True)
    urgency_display = serializers.CharField(source='get_urgency_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ProblemRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'ip_address']


class JobCategorySerializer(serializers.ModelSerializer):
    jobs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'slug', 'icon', 'description', 'jobs_count', 'created_at']
    
    def get_jobs_count(self, obj):
        return obj.jobs.filter(is_active=True).count()


class JobSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    employment_type_display = serializers.CharField(source='get_employment_type_display', read_only=True)
    experience_level_display = serializers.CharField(source='get_experience_level_display', read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['views_count', 'applications_count', 'created_at', 'updated_at', 'slug']


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.SerializerMethodField()
    job_slug = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['applied_at', 'updated_at', 'ip_address', 'status']
    
    def get_job_title(self, obj):
        if obj.job:
            return obj.job.title
        return 'Unknown Job'
    
    def get_job_slug(self, obj):
        if obj.job:
            return obj.job.slug
        return ''


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'company', 'service', 'subject', 'message', 'budget']

    def validate_email(self, value):
        return value.lower().strip()

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return value.strip()

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return value.strip()


class TechStackSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = TechStack
        fields = ['id', 'name', 'logo_url', 'category']

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = ['id', 'label', 'value', 'suffix', 'icon']
        

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    plan_id = serializers.IntegerField(write_only=True)
    user_phone = serializers.CharField(write_only=True, required=False)
    company = serializers.CharField(write_only=True, required=False)
    billing_cycle = serializers.CharField(write_only=True, required=False)
    card_last4 = serializers.CharField(write_only=True, required=False)
    
    plan_details = SubscriptionPlanSerializer(source='plan', read_only=True)
    
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['subscription_id', 'start_date', 'updated_at', 'plan_details']
        extra_kwargs = {
            'end_date': {'required': False},
            'subscription_id': {'required': False},
        }
    
    def create(self, validated_data):
        # Extract extra fields
        plan_id = validated_data.pop('plan_id')
        user_phone = validated_data.pop('user_phone', '')
        company = validated_data.pop('company', '')
        billing_cycle = validated_data.pop('billing_cycle', 'monthly')
        card_last4 = validated_data.pop('card_last4', '')
        
        # Get the plan
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            raise serializers.ValidationError({'plan_id': 'Invalid plan selected'})
        
        # Calculate end date based on billing cycle
        from datetime import datetime, timedelta
        start_date = datetime.now()
        if billing_cycle == 'yearly':
            end_date = start_date + timedelta(days=365)
        else:
            end_date = start_date + timedelta(days=30)
        
        # Generate unique subscription ID
        import uuid
        subscription_id = f"SUB-{uuid.uuid4().hex[:8].upper()}"
        
        # Create subscription
        subscription = Subscription.objects.create(
            plan=plan,
            subscription_id=subscription_id,
            start_date=start_date,
            end_date=end_date,
            status='active',
            auto_renew=True,
            **validated_data
        )
        
        # Create payment method if card provided
        if card_last4:
            PaymentMethod.objects.create(
                user_email=validated_data.get('user_email'),
                payment_type='card',
                card_last4=card_last4,
                card_brand='Card',
                is_default=not PaymentMethod.objects.filter(
                    user_email=validated_data.get('user_email')
                ).exists()
            )
        
        # Create invoice
        from django.utils import timezone
        Invoice.objects.create(
            invoice_number=f"INV-{subscription_id}",
            subscription=subscription,
            customer_name=validated_data.get('user_name'),
            customer_email=validated_data.get('user_email'),
            customer_phone=user_phone,
            customer_company=company,
            amount=plan.price,
            tax=plan.price * 0.18,  # 18% tax example
            total_amount=plan.price * 1.18,
            payment_method='card',
            due_date=timezone.now().date() + timedelta(days=7),
            status='paid',
            items=[{
                'description': f"{plan.name} Plan - {billing_cycle} subscription",
                'quantity': 1,
                'unit_price': float(plan.price),
                'total': float(plan.price)
            }]
        )
        
        return subscription
    

from django.utils import timezone
import uuid

class SubscriptionCreateSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField()
    user_name = serializers.CharField(max_length=200)
    user_email = serializers.EmailField()
    user_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    company = serializers.CharField(max_length=200, required=False, allow_blank=True)
    billing_cycle = serializers.ChoiceField(choices=['monthly', 'yearly'], default='monthly')
    
    def validate_plan_id(self, value):
        try:
            plan = SubscriptionPlan.objects.get(id=value, is_active=True)
            return value
        except SubscriptionPlan.DoesNotExist:
            raise serializers.ValidationError("Selected plan is not available")
    
    def create(self, validated_data):
        from datetime import timedelta
        
        plan = SubscriptionPlan.objects.get(id=validated_data['plan_id'])
        
        # Use timezone-aware datetime
        start_date = timezone.now()
        billing_cycle = validated_data.get('billing_cycle', 'monthly')
        
        if billing_cycle == 'yearly':
            end_date = start_date + timedelta(days=365)
        else:
            end_date = start_date + timedelta(days=30)
        
        subscription_id = f"SUB-{uuid.uuid4().hex[:12].upper()}"
        
        # Create subscription
        subscription = Subscription.objects.create(
            plan=plan,
            user_name=validated_data['user_name'],
            user_email=validated_data['user_email'],
            subscription_id=subscription_id,
            start_date=start_date,
            end_date=end_date,
            status='pending_approval',
            payment_status='pending',
            auto_renew=True
        )
        
        # Create pending invoice
        if billing_cycle == 'yearly':
            price = float(plan.price) * 12 * 0.8
        else:
            price = float(plan.price)
        
        tax_amount = price * 0.18
        total_amount = price + tax_amount
        
        Invoice.objects.create(
            invoice_number=f"INV-{subscription_id}",
            subscription=subscription,
            customer_name=validated_data['user_name'],
            customer_email=validated_data['user_email'],
            customer_phone=validated_data.get('user_phone', ''),
            customer_company=validated_data.get('company', ''),
            amount=price,
            tax=tax_amount,
            total_amount=total_amount,
            currency='INR',
            payment_method='pending',
            issue_date=timezone.now().date(),
            due_date=timezone.now().date() + timedelta(days=7),
            status='pending',
            items=[{
                'name': f"{plan.name} Plan",
                'description': f"{billing_cycle} subscription",
                'quantity': 1,
                'unit_price': price,
                'total': price
            }]
        )
        
        return subscription


class InitiatePaymentSerializer(serializers.Serializer):
    subscription_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=['card', 'upi', 'netbanking'])

class VerifyPaymentSerializer(serializers.Serializer):
    subscription_id = serializers.IntegerField()
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()

class ManualPaymentProofSerializer(serializers.Serializer):
    subscription_id = serializers.IntegerField()
    transaction_id = serializers.CharField()
    payment_screenshot = serializers.ImageField()
    upi_id = serializers.CharField()


class InvoiceSerializer(serializers.ModelSerializer):
    subscription_details = SubscriptionSerializer(source='subscription', read_only=True)
    
    class Meta:
        model = Invoice
        fields = '__all__'


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = '__all__'
        
class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'
        read_only_fields = ['created_at']
        
        
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'mobile_number', 
            'alternative_mobile', 'address', 'alternative_address', 
            'username', 'password', 'confirm_password', 'user_type',
            'date_of_birth', 'bio', 'website', 'github_url', 'linkedin_url', 'profile_photo'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'username': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'mobile_number': {'required': True},
            'address': {'required': True}
        }
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value
    
    def validate_mobile_number(self, value):
        if not value or len(value) < 10:
            raise serializers.ValidationError("Please enter a valid mobile number")
        return value
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        # Password will be hashed in the view
        return super().create(validated_data)

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise serializers.ValidationError("Email and password are required")
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")
        
        # Check password using Django's check_password
        from django.contrib.auth.hashers import check_password
        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password")
        
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled")
        
        data['user'] = user
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'username',
            'mobile_number', 'alternative_mobile', 'address', 'alternative_address',
            'user_type', 'profile_photo', 'profile_photo_url', 'date_of_birth',
            'bio', 'website', 'github_url', 'linkedin_url', 'is_email_verified',
            'created_at'
        ]
    
    def get_profile_photo_url(self, obj):
        request = self.context.get('request')
        if obj.profile_photo and request:
            return request.build_absolute_uri(obj.profile_photo.url)
        return None
    
    def get_full_name(self, obj):
        return obj.get_full_name()

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'mobile_number', 'alternative_mobile',
            'address', 'alternative_address', 'user_type', 'profile_photo',
            'date_of_birth', 'bio', 'website', 'github_url', 'linkedin_url'
        ]