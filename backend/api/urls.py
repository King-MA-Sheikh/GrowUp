from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    register_user, login_user, logout_user, 
    get_current_user, update_profile, upload_profile_photo
)

router = DefaultRouter()
router.register('services', views.ServiceViewSet, basename='service')
router.register('projects', views.ProjectViewSet, basename='project')
router.register('testimonials', views.TestimonialViewSet, basename='testimonial')
router.register('tech-stack', views.TechStackViewSet, basename='techstack')
router.register('stats', views.StatViewSet, basename='stat')
router.register('technologies', views.TechnologyViewSet)
router.register('team-members', views.TeamMemberViewSet)
router.register('meeting-requests', views.MeetingRequestViewSet)
router.register('project-requests', views.ProjectRequestViewSet)
router.register('problems', views.ProblemPostViewSet)
router.register('job-categories', views.JobCategoryViewSet)
router.register('jobs', views.JobViewSet)
router.register('job-applications', views.JobApplicationViewSet)
router.register('subscription-plans', views.SubscriptionPlanViewSet)
router.register('subscriptions', views.SubscriptionViewSet)
router.register('invoices', views.InvoiceViewSet)
router.register('payments', views.PaymentTransactionViewSet)
router.register('payment-methods', views.PaymentMethodViewSet)

urlpatterns = [
    path('', views.api_overview),
    path('', include(router.urls)),
    path('projects/stats/', views.ProjectStatsView.as_view(), name='project-stats'),
    path('contact/', views.ContactMessageView.as_view(), name='contact'),
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
    path('auth/me/', get_current_user, name='current-user'),
    path('auth/update-profile/', update_profile, name='update-profile'),
    path('auth/upload-photo/', upload_profile_photo, name='upload-photo'),
]