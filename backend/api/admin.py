from django.contrib import admin
from .models import *
from django.conf import settings
from datetime import datetime


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 3
    fields = ['image', 'caption', 'order']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'description']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'is_featured', 'order', 'created_at']
    list_filter = ['category', 'status', 'is_featured', 'created_at']
    list_editable = ['order', 'is_featured']
    search_fields = ['title', 'short_description', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category', 'short_description', 'description')
        }),
        ('Media', {
            'fields': ('featured_image', 'gallery_images', 'video_url')
        }),
        ('Technologies & Features', {
            'fields': ('tech_stack', 'features')
        }),
        ('Project Details', {
            'fields': ('challenges', 'solutions', 'results')
        }),
        ('Links', {
            'fields': ('live_url', 'github_url')
        }),
        ('Status & Client Info', {
            'fields': ('status', 'is_featured', 'order', 'completion_date', 'client_name', 'client_review', 'client_rating')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'caption', 'order']
    list_editable = ['order']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'client_company', 'rating', 'is_active']
    list_filter = ['rating', 'is_active']
    list_editable = ['is_active']


from .models import TeamMember

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'experience_years', 'is_featured', 'is_available', 'order']
    list_filter = ['role', 'is_featured', 'is_available', 'is_active']
    list_editable = ['order', 'is_featured', 'is_available']
    search_fields = ['name', 'role', 'skills', 'bio']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'slug', 'role', 'bio', 'short_bio')
        }),
        ('Professional Details', {
            'fields': ('experience_years', 'projects_completed', 'rating', 'skills', 'certifications', 'languages')
        }),
        ('Media', {
            'fields': ('profile_image', 'cover_image')
        }),
        ('Social Links', {
            'fields': ('github_url', 'linkedin_url', 'twitter_url', 'portfolio_url')
        }),
        ('Availability & Status', {
            'fields': ('is_available', 'is_featured', 'is_active', 'order')
        }),
        ('Featured Projects', {
            'fields': ('featured_projects',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    

@admin.register(MeetingRequest)
class MeetingRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'service', 'preferred_date', 'preferred_time', 'status', 'created_at']
    list_filter = ['status', 'service', 'created_at', 'preferred_date']
    list_editable = ['status']
    search_fields = ['full_name', 'email', 'phone', 'company', 'message']
    readonly_fields = ['ip_address', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'email', 'phone', 'company')
        }),
        ('Meeting Details', {
            'fields': ('service', 'budget', 'preferred_date', 'preferred_time', 'message')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('ip_address', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_confirmed', 'mark_as_completed', 'mark_as_cancelled']
    
    def mark_as_confirmed(self, request, queryset):
        queryset.update(status='confirmed')
        self.message_user(request, f"{queryset.count()} meeting request(s) marked as confirmed.")
    mark_as_confirmed.short_description = "Mark selected as confirmed"
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
        self.message_user(request, f"{queryset.count()} meeting request(s) marked as completed.")
    mark_as_completed.short_description = "Mark selected as completed"
    
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(request, f"{queryset.count()} meeting request(s) marked as cancelled.")
    mark_as_cancelled.short_description = "Mark selected as cancelled"


from .models import ProjectRequest

@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'developer_name', 'project_type', 'timeline', 'status', 'created_at']
    list_filter = ['status', 'project_type', 'timeline', 'created_at']
    list_editable = ['status']
    search_fields = ['full_name', 'email', 'phone', 'developer_name', 'description']
    readonly_fields = ['ip_address', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Client Information', {
            'fields': ('full_name', 'email', 'phone', 'company')
        }),
        ('Project Details', {
            'fields': ('developer_id', 'developer_name', 'technologies', 'project_type', 'timeline', 'budget', 'description', 'requirements')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('ip_address', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'employment_type', 'is_active', 'is_featured', 'applications_count', 'created_at']
    list_filter = ['category', 'employment_type', 'experience_level', 'is_active', 'is_featured', 'is_remote']
    list_editable = ['is_active', 'is_featured']
    search_fields = ['title', 'description', 'requirements']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = []
    readonly_fields = ['views_count', 'applications_count', 'created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category', 'description', 'requirements', 'responsibilities', 'benefits')
        }),
        ('Job Details', {
            'fields': ('employment_type', 'experience_level', 'location', 'salary_min', 'salary_max', 'salary_currency')
        }),
        ('Skills', {
            'fields': ('required_skills', 'preferred_skills')
        }),
        ('Application', {
            'fields': ('application_deadline', 'positions_available')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured', 'is_remote')
        }),
        ('Metadata', {
            'fields': ('views_count', 'applications_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'job', 'email', 'status', 'interview_date', 'applied_at']
    list_filter = ['status', 'job__category', 'applied_at']
    list_editable = ['status']
    search_fields = ['full_name', 'email', 'phone', 'skills']
    readonly_fields = ['applied_at', 'updated_at', 'ip_address']
    
    actions = ['schedule_interview', 'shortlist_applications', 'send_offer']
    
    def schedule_interview(self, request, queryset):
        for application in queryset:
            application.status = 'interview_scheduled'
            # You can add interview scheduling logic here
            application.save()
        self.message_user(request, f"{queryset.count()} interview(s) scheduled.")
    schedule_interview.short_description = "Schedule Interview"
    
    def shortlist_applications(self, request, queryset):
        queryset.update(status='shortlisted')
        self.message_user(request, f"{queryset.count()} application(s) shortlisted.")
    shortlist_applications.short_description = "Shortlist selected"
    
    def send_offer(self, request, queryset):
        queryset.update(status='offered')
        self.message_user(request, f"Offer sent to {queryset.count()} candidate(s).")
    send_offer.short_description = "Send Offer"


@admin.register(ProblemRequest)
class ProblemRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'problem_title', 'problem_category', 'urgency', 'status', 'created_at']
    list_filter = ['status', 'problem_category', 'urgency', 'programming_language', 'created_at']
    list_editable = ['status']
    search_fields = ['full_name', 'email', 'phone', 'problem_title', 'problem_description']
    readonly_fields = ['ip_address', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Client Information', {
            'fields': ('full_name', 'email', 'phone', 'company', 'ip_address')
        }),
        ('Problem Details', {
            'fields': ('problem_title', 'problem_category', 'programming_language', 'urgency', 
                      'problem_description', 'expected_output', 'current_error')
        }),
        ('Code', {
            'fields': ('code_snippet', 'code_file')
        }),
        ('Solution', {
            'fields': ('status', 'solution', 'solution_code')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'service', 'subject', 'status', 'created_at']
    list_filter = ['status', 'service', 'created_at']
    list_editable = ['status']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['ip_address', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(TechStack)
class TechStackAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'order', 'is_active']
    list_editable = ['order', 'is_active']


@admin.register(Stat)
class StatAdmin(admin.ModelAdmin):
    list_display = ['label', 'value', 'suffix', 'order']
    list_editable = ['order']
    
    
@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user_name', 'user_email', 'plan', 'status', 'payment_status', 'payment_verified_at']
    list_filter = ['status', 'payment_status', 'plan']
    list_editable = ['status', 'payment_status']
    search_fields = ['user_name', 'user_email', 'subscription_id']
    
    actions = ['approve_payment_and_activate']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user_name', 'user_email', 'subscription_id')
        }),
        ('Plan Details', {
            'fields': ('plan', 'start_date', 'end_date', 'auto_renew')
        }),
        ('Payment Information', {
            'fields': ('payment_status', 'payment_amount', 'payment_method_detail', 
                      'razorpay_order_id', 'razorpay_payment_id', 'payment_proof')
        }),
        ('Verification', {
            'fields': ('payment_verified_at', 'payment_verified_by', 'approved_at', 'approved_by')
        }),
        ('Admin Notes', {
            'fields': ('admin_notes',)
        }),
    )
    
    def approve_payment_and_activate(self, request, queryset):
        from django.core.management import call_command
        for subscription in queryset:
            # Call the approval function
            from django.core.mail import send_mail
            subscription.status = 'active'
            subscription.payment_status = 'verified'
            subscription.payment_verified_at = datetime.now()
            subscription.payment_verified_by = request.user.username
            subscription.approved_at = datetime.now()
            subscription.approved_by = request.user.username
            subscription.save()
            
            # Send email
            send_mail(
                'Premium Plan Activated',
                f'Dear {subscription.user_name},\n\nYour {subscription.plan.name} plan has been activated!\n\nThank you for choosing GrowUp!',
                settings.DEFAULT_FROM_EMAIL,
                [subscription.user_email],
                fail_silently=False,
            )
            
        self.message_user(request, f"{queryset.count()} subscriptions approved and emails sent.")
    approve_payment_and_activate.short_description = "Approve payment and activate subscription"