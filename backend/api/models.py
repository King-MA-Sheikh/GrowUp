from django.db import models
from django.utils.text import slugify
from ckeditor.fields import RichTextField
from django.utils import timezone
import uuid

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile App Development'),
        ('fullstack', 'Full Stack Development'),
        ('networking', 'Networking Solutions'),
        ('cloud', 'Cloud & DevOps'),
    ]

    title = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    icon = models.CharField(max_length=50, help_text="Lucide icon name, e.g. 'Code2'")
    features = models.JSONField(default=list, help_text='List of feature strings')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class Project(models.Model):
    STATUS_CHOICES = [
        ('live', 'Live'),
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
    ]

    # Basic Information
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField(blank=True, null=True)
    
    # Categories and Technologies
    category = models.CharField(max_length=100, default='Web Development')
    tech_stack = models.JSONField(default=list, blank=True)
    
    # Media
    featured_image = models.ImageField(upload_to='projects/featured/', blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True)
    video_url = models.URLField(blank=True, null=True)
    
    # Project Details
    features = models.JSONField(default=list, blank=True)
    challenges = models.TextField(blank=True)
    solutions = models.TextField(blank=True)
    results = models.TextField(blank=True)
    
    # Links
    live_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    
    # Status & Metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    is_featured = models.BooleanField(default=False)
    completion_date = models.DateField(blank=True, null=True)
    client_name = models.CharField(max_length=200, blank=True)
    client_review = models.TextField(blank=True)
    client_rating = models.PositiveSmallIntegerField(default=5)
    
    # SEO Fields - Make these nullable
    meta_title = models.CharField(max_length=200, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    meta_keywords = models.CharField(max_length=500, blank=True, null=True)
    
    # Ordering
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Remove 'is_live' from ordering - it doesn't exist
        ordering = ['-is_featured', 'order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']


class Testimonial(models.Model):
    client_name = models.CharField(max_length=100)
    client_role = models.CharField(max_length=100)
    client_company = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    message = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.client_name} — {self.client_company}"


from django.db import models
from django.utils.text import slugify

class Technology(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True, max_length=120, null=True)
    category = models.CharField(max_length=100, blank=True)
    subcategory = models.CharField(max_length=100, blank=True)
    icon = models.CharField(max_length=10, blank=True, help_text="Emoji icon for the technology")
    description = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    popularity = models.IntegerField(default=0, help_text="Popularity score (0-100)")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'subcategory', 'name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['is_active']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = slugify(self.name)[:120]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('ceo', 'CEO & Founder'),
        ('cto', 'CTO'),
        ('lead_backend', 'Lead Backend Developer'),
        ('lead_frontend', 'Lead Frontend Developer'),
        ('lead_devops', 'Lead DevOps Engineer'),
        ('lead_mobile', 'Lead Mobile Developer'),
        ('senior_backend', 'Senior Backend Developer'),
        ('senior_frontend', 'Senior Frontend Developer'),
        ('senior_devops', 'Senior DevOps Engineer'),
        ('senior_mobile', 'Senior Mobile Developer'),
        ('backend_dev', 'Backend Developer'),
        ('frontend_dev', 'Frontend Developer'),
        ('devops_engineer', 'DevOps Engineer'),
        ('mobile_dev', 'Mobile Developer'),
        ('qa_engineer', 'QA Engineer'),
        ('ui_ux_designer', 'UI/UX Designer'),
        ('project_manager', 'Project Manager'),
        ('data_scientist', 'Data Scientist'),
        ('ai_engineer', 'AI Engineer'),
        ('security_engineer', 'Security Engineer'),
    ]

    # Personal Information
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    bio = models.TextField()
    short_bio = models.CharField(max_length=200, blank=True)
    
    # Professional Details
    experience_years = models.PositiveIntegerField(default=0)
    projects_completed = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    
    # Skills
    skills = models.JSONField(default=list, help_text='List of technology skills')
    certifications = models.JSONField(default=list, blank=True)
    languages = models.JSONField(default=list, blank=True)
    
    # Social Links
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    
    # Media
    profile_image = models.ImageField(upload_to='team/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='team/covers/', blank=True, null=True)
    
    # Availability
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Featured Projects they worked on
    featured_projects = models.JSONField(default=list, blank=True)
    
    # Ordering
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-is_featured', 'name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['slug']),
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_featured']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.get_role_display()}"


class MeetingRequest(models.Model):
    SERVICE_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile App Development'),
        ('fullstack', 'Full Stack Development'),
        ('cloud', 'Cloud & DevOps'),
        ('ai', 'AI & Machine Learning'),
        ('blockchain', 'Blockchain & Web3'),
        ('consulting', 'Technical Consulting'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]

    # Personal Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    company = models.CharField(max_length=200, blank=True)
    
    # Meeting Details
    service = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    budget = models.CharField(max_length=100, blank=True)
    preferred_date = models.DateField()
    preferred_time = models.CharField(max_length=50)
    message = models.TextField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Meeting Request'
        verbose_name_plural = 'Meeting Requests'

    def __str__(self):
        return f"{self.full_name} - {self.get_service_display()} - {self.preferred_date}"

    def get_service_display(self):
        return dict(self.SERVICE_CHOICES).get(self.service, self.service)
    

class ProjectRequest(models.Model):
    PROJECT_TYPE_CHOICES = [
        ('new', 'New Project from Scratch'),
        ('existing', 'Enhance Existing Project'),
        ('migration', 'Migration to New Tech'),
        ('consulting', 'Technical Consulting'),
        ('maintenance', 'Maintenance & Support'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    # Client Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    company = models.CharField(max_length=200, blank=True)
    
    # Project Details
    developer_id = models.IntegerField()
    developer_name = models.CharField(max_length=200)
    technologies = models.JSONField(default=list)
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES)
    timeline = models.CharField(max_length=50)
    budget = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project Request'
        verbose_name_plural = 'Project Requests'

    def __str__(self):
        return f"{self.full_name} - {self.project_type} - {self.developer_name}"


class ProblemRequest(models.Model):
    CATEGORY_CHOICES = [
        ('bug_fix', 'Bug Fixing'),
        ('code_optimization', 'Code Optimization'),
        ('feature_development', 'Feature Development'),
        ('code_review', 'Code Review'),
        ('refactoring', 'Code Refactoring'),
        ('debugging', 'Debugging'),
        ('security_audit', 'Security Audit'),
        ('performance_tuning', 'Performance Tuning'),
        ('code_migration', 'Code Migration'),
        ('documentation', 'Documentation'),
        ('testing', 'Testing'),
        ('other', 'Other'),
    ]
    
    URGENCY_CHOICES = [
        ('low', 'Low - Can wait 1-2 weeks'),
        ('medium', 'Medium - Need within a week'),
        ('high', 'High - Need within 2-3 days'),
        ('critical', 'Critical - ASAP (24 hours)'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Under Review'),
        ('solved', 'Solved'),
        ('rejected', 'Rejected'),
        ('in_progress', 'In Progress'),
    ]

    # Client Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    company = models.CharField(max_length=200, blank=True)
    
    # Problem Details
    problem_title = models.CharField(max_length=500)
    problem_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    programming_language = models.CharField(max_length=50)
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='medium')
    code_snippet = models.TextField(blank=True)
    code_file = models.FileField(upload_to='problem_codes/', blank=True, null=True)
    problem_description = models.TextField()
    expected_output = models.TextField(blank=True)
    current_error = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    solution = models.TextField(blank=True)
    solution_code = models.TextField(blank=True)
    
    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Problem Request'
        verbose_name_plural = 'Problem Requests'

    def __str__(self):
        return f"{self.full_name} - {self.problem_title} - {self.get_urgency_display()}"
    

class ProblemPost(models.Model):
    CATEGORY_CHOICES = [
        ('bug_fix', 'Bug Fixing'),
        ('code_optimization', 'Code Optimization'),
        ('feature_development', 'Feature Development'),
        ('code_review', 'Code Review'),
        ('refactoring', 'Code Refactoring'),
        ('debugging', 'Debugging'),
        ('security_audit', 'Security Audit'),
        ('performance_tuning', 'Performance Tuning'),
        ('code_migration', 'Code Migration'),
        ('documentation', 'Documentation'),
        ('testing', 'Testing'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    # User Information
    user_name = models.CharField(max_length=200)
    user_email = models.EmailField()
    user_phone = models.CharField(max_length=20, blank=True)
    
    # Problem Details
    title = models.CharField(max_length=500)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    technologies = models.JSONField(default=list, help_text='List of required technologies')
    budget = models.CharField(max_length=100, blank=True)
    deadline = models.DateField(null=True, blank=True)
    
    # File Attachments
    attachments = models.JSONField(default=list, blank=True)
    
    # Assignment
    assigned_to = models.ForeignKey('TeamMember', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_problems')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user_name}"


class ProblemMessage(models.Model):
    problem = models.ForeignKey(ProblemPost, on_delete=models.CASCADE, related_name='messages')
    sender_name = models.CharField(max_length=200)
    sender_email = models.EmailField()
    sender_type = models.CharField(max_length=20, choices=[('user', 'User'), ('developer', 'Developer')])
    message = models.TextField()
    attachments = models.JSONField(default=list, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message from {self.sender_name} on {self.problem.title}"


class ProblemOffer(models.Model):
    problem = models.ForeignKey(ProblemPost, on_delete=models.CASCADE, related_name='offers')
    developer = models.ForeignKey('TeamMember', on_delete=models.CASCADE, related_name='offers')
    message = models.TextField()
    estimated_time = models.CharField(max_length=100)
    estimated_cost = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='pending', choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Offer from {self.developer.name} for {self.problem.title}"
    
    
class JobCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Job Categories"
        ordering = ['name']

from django.conf import settings

class Job(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
        ('internship', 'Internship'),
    ]

    EXPERIENCE_LEVEL_CHOICES = [
        ('fresher', 'Fresher (0-1 years)'),
        ('entry', 'Entry Level (1-2 years)'),
        ('mid', 'Mid Level (2-5 years)'),
        ('senior', 'Senior Level (5-8 years)'),
        ('lead', 'Lead Level (8+ years)'),
        ('expert', 'Expert Level (10+ years)'),
    ]

    # Basic Information
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(JobCategory, on_delete=models.CASCADE, related_name='jobs')
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField()
    benefits = models.TextField(blank=True)
    
    # Job Details
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='full_time')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='fresher')
    location = models.CharField(max_length=200, default='Remote (Work From Home)')
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=3, default='INR')
    
    # Required Skills
    required_skills = models.JSONField(default=list, help_text='List of required skills')
    preferred_skills = models.JSONField(default=list, blank=True)
    
    # Application Details
    application_deadline = models.DateField(null=True, blank=True)
    positions_available = models.PositiveIntegerField(default=1)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_remote = models.BooleanField(default=True)
    
    # Metadata
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0)
    applications_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
            models.Index(fields=['category']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.location}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewing', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interview_completed', 'Interview Completed'),
        ('offered', 'Offer Extended'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    
    # Applicant Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    current_location = models.CharField(max_length=200, blank=True)
    years_experience = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    
    # Professional Details
    resume = models.FileField(upload_to='job_applications/resumes/')
    cover_letter = models.TextField()
    portfolio_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    
    # Skills
    skills = models.JSONField(default=list, help_text='List of applicant skills')
    
    # Availability
    expected_salary = models.CharField(max_length=100, blank=True)
    notice_period = models.CharField(max_length=100, blank=True)
    
    # Interview Details
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_notes = models.TextField(blank=True)
    interview_link = models.URLField(blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    
    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        unique_together = ['job', 'email']

    def __str__(self):
        return f"{self.full_name} - {self.job.title}"


class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('closed', 'Closed'),
    ]

    SERVICE_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile App Development'),
        ('fullstack', 'Full Stack Development'),
        ('networking', 'Networking Solutions'),
        ('cloud', 'Cloud & DevOps'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True)
    service = models.CharField(max_length=20, choices=SERVICE_CHOICES, default='other')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    budget = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='new')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.subject}"


class TechStack(models.Model):
    name = models.CharField(max_length=50)
    logo = models.ImageField(upload_to='tech/', blank=True, null=True)
    category = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Stat(models.Model):
    label = models.CharField(max_length=60)
    value = models.CharField(max_length=20)
    suffix = models.CharField(max_length=10, blank=True, default='+')
    icon = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.value}{self.suffix} {self.label}"
    
    
class SubscriptionPlan(models.Model):
    PLAN_TYPES = [
        ('basic', 'Basic'),
        ('pro', 'Professional'),
        ('enterprise', 'Enterprise'),
        ('custom', 'Custom'),
    ]
    
    BILLING_CYCLES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('one_time', 'One Time'),
    ]
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLES, default='monthly')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    # Features
    features = models.JSONField(default=list, help_text='List of features')
    max_projects = models.IntegerField(default=5)
    max_team_members = models.IntegerField(default=3)
    storage_gb = models.IntegerField(default=10)
    support_priority = models.CharField(max_length=50, default='Standard')
    api_access = models.BooleanField(default=False)
    custom_branding = models.BooleanField(default=False)
    analytics = models.BooleanField(default=False)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} - {self.billing_cycle}"


class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('pending', 'Pending'),
        ('pending_approval', 'Pending Approval'),  # New status
        ('payment_verified', 'Payment Verified'),   # New status
    ]
    
    # Add these new fields
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ], default='pending')
    
    payment_proof = models.FileField(upload_to='payment_proofs/', blank=True, null=True)
    payment_verified_at = models.DateTimeField(blank=True, null=True)
    payment_verified_by = models.CharField(max_length=100, blank=True)
    admin_notes = models.TextField(blank=True)
    
    # Existing fields
    user_email = models.EmailField()
    user_name = models.CharField(max_length=200)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_approval')
    auto_renew = models.BooleanField(default=True)
    subscription_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
     # Payment Gateway Fields
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)
    
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payment_currency = models.CharField(max_length=3, default='INR')
    payment_method_detail = models.CharField(max_length=100, blank=True)
    
    # Payment Verification
    payment_verified_at = models.DateTimeField(blank=True, null=True)
    payment_verified_by = models.CharField(max_length=100, blank=True)
    
    # Admin Actions
    approved_at = models.DateTimeField(blank=True, null=True)
    approved_by = models.CharField(max_length=100, blank=True)
    activation_email_sent = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user_name} - {self.plan.name} - {self.status}"
    
    def save(self, *args, **kwargs):
        if not self.subscription_id:
            self.subscription_id = f"SUB-{uuid.uuid4().hex[:12].upper()}"
        
        # Make end_date timezone-aware if it's naive
        if self.end_date and timezone.is_naive(self.end_date):
            self.end_date = timezone.make_aware(self.end_date)
        
        if self.start_date and timezone.is_naive(self.start_date):
            self.start_date = timezone.make_aware(self.start_date)
        
        super().save(*args, **kwargs)


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHODS = [
        ('card', 'Credit Card'),
        ('bank', 'Bank Transfer'),
        ('paypal', 'PayPal'),
        ('razorpay', 'Razorpay'),
        ('stripe', 'Stripe'),
    ]
    
    invoice_number = models.CharField(max_length=50, unique=True)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='invoices')
    
    # Customer Details
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20, blank=True)
    customer_company = models.CharField(max_length=200, blank=True)
    
    # Billing Details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    
    # Dates
    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    paid_date = models.DateTimeField(null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Items
    items = models.JSONField(default=list, help_text='List of invoice items')
    
    # Metadata
    notes = models.TextField(blank=True)
    transaction_id = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.invoice_number} - {self.customer_name} - {self.total_amount}"


class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    transaction_id = models.CharField(max_length=200, unique=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_id} - {self.status}"
    
class PaymentMethod(models.Model):
    PAYMENT_TYPES = [
        ('card', 'Credit/Debit Card'),
        ('upi', 'UPI'),
        ('bank', 'Bank Transfer'),
        ('paypal', 'PayPal'),
    ]
    
    user_email = models.EmailField()
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    is_default = models.BooleanField(default=False)
    
    # Card details
    card_last4 = models.CharField(max_length=4, blank=True)
    card_brand = models.CharField(max_length=50, blank=True)
    card_expiry = models.CharField(max_length=7, blank=True)
    cardholder_name = models.CharField(max_length=200, blank=True)
    
    # UPI details
    upi_id = models.CharField(max_length=100, blank=True)
    
    # Bank details
    bank_name = models.CharField(max_length=200, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    account_holder = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        if self.payment_type == 'card':
            return f"Card ending in {self.card_last4}"
        elif self.payment_type == 'upi':
            return f"UPI: {self.upi_id}"
        else:
            return f"Bank: {self.bank_name}"
        
        
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not username:
            raise ValueError('Username is required')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        return self.create_user(email, username, first_name, last_name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('freelancer', 'Freelancer'),
        ('customer', 'Customer'),
        ('developer', 'Developer'),
    ]
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15)
    alternative_mobile = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField()
    alternative_address = models.TextField(blank=True, null=True)
    username = models.CharField(max_length=150, unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='customer')
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    
    # Additional fields
    date_of_birth = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    
    # Django required fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    # Fix reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    # Email verification
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    # Reset password
    reset_password_token = models.CharField(max_length=100, blank=True, null=True)
    reset_password_expires = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    objects = UserManager()
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_short_name(self):
        return self.first_name
    
    def get_profile_photo_url(self):
        if self.profile_photo:
            return self.profile_photo.url
        return None