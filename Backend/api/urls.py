from django.urls import path, include, re_path
from rest_framework.routers import SimpleRouter
from .views import (
    HealthCheckView, AuthViewSet, UserViewSet, DeveloperViewSet,
    PropertyViewSet, EventViewSet, LeadViewSet, TestimonialViewSet,
    PropertySubmissionViewSet, CareerViewSet, JobApplicationViewSet,
    ContentViewSet, UploadView
)

class OptionalSlashRouter(SimpleRouter):
    def __init__(self):
        super().__init__()
        self.trailing_slash = '/?'

router = OptionalSlashRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'developers', DeveloperViewSet, basename='developer')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'events', EventViewSet, basename='event')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'property-submissions', PropertySubmissionViewSet, basename='property-submission')
router.register(r'careers', CareerViewSet, basename='career')
router.register(r'job-applications', JobApplicationViewSet, basename='job-application')
router.register(r'content', ContentViewSet, basename='content')

auth_login = AuthViewSet.as_view({'post': 'login'})
auth_register = AuthViewSet.as_view({'post': 'register'})
auth_setup_status = AuthViewSet.as_view({'get': 'setup_status'})
auth_profile = AuthViewSet.as_view({'put': 'update_profile'})
auth_password = AuthViewSet.as_view({'put': 'change_password'})
auth_me = AuthViewSet.as_view({'get': 'get_me'})
auth_send_otp = AuthViewSet.as_view({'post': 'send_otp'})
auth_verify_otp = AuthViewSet.as_view({'post': 'verify_otp'})

urlpatterns = [
    # Health check
    re_path(r'^health/?$', HealthCheckView.as_view(), name='health'),

    # Auth routes
    re_path(r'^auth/login/?$', auth_login, name='auth-login'),
    re_path(r'^auth/register/?$', auth_register, name='auth-register'),
    re_path(r'^auth/setup-status/?$', auth_setup_status, name='auth-setup-status'),
    re_path(r'^auth/profile/?$', auth_profile, name='auth-profile'),
    re_path(r'^auth/password/?$', auth_password, name='auth-password'),
    re_path(r'^auth/me/?$', auth_me, name='auth-me'),
    re_path(r'^auth/send-otp/?$', auth_send_otp, name='auth-send-otp'),
    re_path(r'^auth/verify-otp/?$', auth_verify_otp, name='auth-verify-otp'),

    # Upload routes
    re_path(r'^upload/image/?$', UploadView.as_view(), {'upload_type': 'image'}, name='upload-image'),
    re_path(r'^upload/images/?$', UploadView.as_view(), {'upload_type': 'images'}, name='upload-images'),

    # Custom action routes with regex to handle both with/without trailing slash
    re_path(r'^users/activities/?$', UserViewSet.as_view({'get': 'activities'}), name='user-activities'),
    re_path(r'^leads/(?P<pk>[^/.]+)/status/?$', LeadViewSet.as_view({'put': 'update_status'}), name='lead-update-status'),
    re_path(r'^property-submissions/(?P<pk>[^/.]+)/convert/?$', PropertySubmissionViewSet.as_view({'post': 'convert'}), name='property-submission-convert'),
    re_path(r'^job-applications/(?P<pk>[^/.]+)/status/?$', JobApplicationViewSet.as_view({'put': 'update_status'}), name='job-application-update-status'),

    # Router registered ViewSets
    re_path(r'^', include(router.urls)),
]
