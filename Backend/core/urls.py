from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from api.views import HealthCheckView

urlpatterns = [
    path('', HealthCheckView.as_view(), name='root-health'),
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
    re_path(r'^uploads/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
