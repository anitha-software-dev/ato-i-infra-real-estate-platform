import os
import uuid
import random
import re
from datetime import datetime, timezone, timedelta
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db.models import Q
from rest_framework import status, views, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import (
    User, Developer, Property, Event, Lead, Career,
    JobApplication, Content, Otp, ActivityLog, Testimonial, PropertySubmission
)
from .serializers import (
    UserSerializer, DeveloperSerializer, PropertySerializer,
    EventSerializer, LeadSerializer, CareerSerializer,
    JobApplicationSerializer, ContentSerializer, OtpSerializer,
    ActivityLogSerializer, TestimonialSerializer, PropertySubmissionSerializer
)
from .authentication import (
    hash_password, compare_password, generate_token,
    IsAdminUserRole, IsAuthenticatedAtoIUser
)


# ============================================================================
# Health Check View
# ============================================================================
class HealthCheckView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'status': 'ok', 'message': 'API is healthy'})


# ============================================================================
# Auth Views
# ============================================================================
class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'success': False, 'message': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'message': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not compare_password(password, user.passwordHash):
            return Response(
                {'success': False, 'message': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        now = datetime.now(timezone.utc)
        user.lastLoginAt = now
        user.save(update_fields=['lastLoginAt'])

        try:
            ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR') or '127.0.0.1'
            ActivityLog.objects.create(
                userId=user,
                userName=user.name,
                userEmail=user.email,
                action='LOGIN',
                details='User logged in to Admin Panel',
                ipAddress=ip.split(',')[0].strip() if ip else '127.0.0.1'
            )
        except Exception:
            pass

        token = generate_token(user)

        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'role': user.role,
                    'lastLoginAt': now.isoformat(),
                },
                'token': token,
            }
        })

    @action(detail=False, methods=['get'], url_path='setup-status')
    def setup_status(self, request):
        admin_exists = User.objects.filter(role='ADMIN').exists()
        return Response({
            'success': True,
            'data': {
                'adminExists': admin_exists,
                'allowSignup': not admin_exists,
                'message': 'Restricted: Admin use only.' if admin_exists else 'Initial admin setup required'
            }
        })

    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        from django.db import transaction
        with transaction.atomic():
            admin_exists = User.objects.filter(role='ADMIN').exists()
            if admin_exists:
                is_admin = bool(request.user and getattr(request.user, 'role', None) == 'ADMIN')
                if not is_admin:
                    return Response(
                        {
                            'success': False,
                            'message': 'Restricted: Admin use only. Please contact your administrator.'
                        },
                        status=status.HTTP_403_FORBIDDEN
                    )

            name = request.data.get('name')
            email = request.data.get('email')
            password = request.data.get('password')
            role = request.data.get('role', 'ADMIN')

            if not name or not email or not password:
                return Response(
                    {'success': False, 'message': 'Name, email, and password are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if User.objects.filter(email=email).exists():
                return Response(
                    {'success': False, 'message': 'Email already in use'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            password_hash = hash_password(password)
            user = User.objects.create(
                name=name,
                email=email,
                passwordHash=password_hash,
                role='USER' if role == 'USER' else 'ADMIN',
                status='Active'
            )

            try:
                ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR') or '127.0.0.1'
                ActivityLog.objects.create(
                    userId=user,
                    userName=user.name,
                    userEmail=user.email,
                    action='REGISTER',
                    details=f"User registered with role {user.role}: {user.name} ({user.email})",
                    ipAddress=ip.split(',')[0].strip() if ip else '127.0.0.1'
                )
            except Exception:
                pass

            token = generate_token(user)

            return Response({
                'success': True,
                'message': 'Admin registered successfully' if user.role == 'ADMIN' else 'User registered successfully',
                'data': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'role': user.role,
                    'token': token,
                    'user': {
                        'id': user.id,
                        'name': user.name,
                        'email': user.email,
                        'role': user.role,
                    }
                }
            }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['put'], url_path='profile', permission_classes=[IsAuthenticatedAtoIUser])
    def update_profile(self, request):
        user = request.user
        name = request.data.get('name')
        email = request.data.get('email')

        if not name or not email:
            return Response({'success': False, 'message': 'Name and email are required'}, status=400)

        user.name = name
        user.email = email
        user.save(update_fields=['name', 'email'])

        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'data': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
            }
        })

    @action(detail=False, methods=['put'], url_path='password', permission_classes=[IsAuthenticatedAtoIUser])
    def change_password(self, request):
        user = request.user
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')

        if not current_password or not new_password:
            return Response({'success': False, 'message': 'Current and new password are required'}, status=400)

        if not compare_password(current_password, user.passwordHash):
            return Response({'success': False, 'message': 'Incorrect current password'}, status=400)

        user.passwordHash = hash_password(new_password)
        user.save(update_fields=['passwordHash'])

        return Response({'success': True, 'message': 'Password changed successfully'})

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticatedAtoIUser])
    def get_me(self, request):
        user = request.user
        return Response({
            'success': True,
            'data': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
            }
        })

    @action(detail=False, methods=['post'], url_path='send-otp')
    def send_otp(self, request):
        phone = request.data.get('phone')
        if not phone:
            return Response({'success': False, 'message': 'Phone number is required'}, status=400)

        code = str(random.randint(1000, 9999))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=1)

        Otp.objects.update_or_create(
            phone=phone,
            defaults={'code': code, 'expiresAt': expires_at}
        )

        print(f"\n==========================================\n[SIMULATED SMS] Sent to {phone}: Your OTP is {code}\n==========================================\n")
        return Response({'success': True, 'message': 'OTP sent successfully'})

    @action(detail=False, methods=['post'], url_path='verify-otp')
    def verify_otp(self, request):
        phone = request.data.get('phone')
        code = request.data.get('code')

        if not phone or not code:
            return Response({'success': False, 'message': 'Phone and OTP code are required'}, status=400)

        otp_record = Otp.objects.filter(phone=phone).first()
        if not otp_record:
            return Response({'success': False, 'message': 'No OTP found for this phone number'}, status=404)

        if datetime.now(timezone.utc) > otp_record.expiresAt:
            return Response({'success': False, 'message': 'OTP has expired. Please request a new one.'}, status=400)

        if otp_record.code != code:
            return Response({'success': False, 'message': 'Invalid OTP'}, status=400)

        otp_record.delete()
        return Response({'success': True, 'message': 'OTP verified successfully'})


# ============================================================================
# User Management Views (Secured - Only Authenticated Administrators)
# ============================================================================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-createdAt')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedAtoIUser, IsAdminUserRole]

    @action(detail=False, methods=['get'], url_path='activities')
    def activities(self, request):
        logs = ActivityLog.objects.all().order_by('-createdAt')[:100]
        serializer = ActivityLogSerializer(logs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def list(self, request, *args, **kwargs):
        users = self.get_queryset()
        serializer = self.get_serializer(users, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'ADMIN')
        status_val = request.data.get('status', 'Active')
        phone = request.data.get('phone')

        if not name or not email or not password:
            return Response({'success': False, 'message': 'Name, email, and password are required'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'success': False, 'message': 'Email already exists'}, status=400)

        password_hash = hash_password(password)
        user = User.objects.create(
            name=name,
            email=email,
            passwordHash=password_hash,
            role='USER' if role == 'USER' else 'ADMIN',
            status='Inactive' if status_val == 'Inactive' else 'Active',
            phone=phone or None,
        )

        try:
            ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR') or '127.0.0.1'
            ActivityLog.objects.create(
                userId=request.user,
                userName=request.user.name,
                userEmail=request.user.email,
                action='CREATE_USER',
                details=f"Created new user: {user.name} ({user.email}) with role {user.role}",
                ipAddress=ip.split(',')[0].strip() if ip else '127.0.0.1'
            )
        except Exception:
            pass

        serializer = self.get_serializer(user)
        return Response({'success': True, 'message': 'User created successfully', 'data': serializer.data}, status=201)

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data

        if 'name' in data:
            user.name = data['name']
        if 'role' in data:
            user.role = data['role']
        if 'status' in data:
            user.status = data['status']
        if 'phone' in data:
            user.phone = data['phone']
        if data.get('password'):
            user.passwordHash = hash_password(data['password'])

        user.save()

        try:
            ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR') or '127.0.0.1'
            ActivityLog.objects.create(
                userId=request.user,
                userName=request.user.name,
                userEmail=request.user.email,
                action='UPDATE_USER',
                details=f"Updated user: {user.name} ({user.email})",
                ipAddress=ip.split(',')[0].strip() if ip else '127.0.0.1'
            )
        except Exception:
            pass

        serializer = self.get_serializer(user)
        return Response({'success': True, 'message': 'User updated successfully', 'data': serializer.data})

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user_name = user.name
        user_email = user.email
        user.delete()

        try:
            ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR') or '127.0.0.1'
            ActivityLog.objects.create(
                userId=request.user,
                userName=request.user.name,
                userEmail=request.user.email,
                action='DELETE_USER',
                details=f"Deleted user: {user_name} ({user_email})",
                ipAddress=ip.split(',')[0].strip() if ip else '127.0.0.1'
            )
        except Exception:
            pass

        return Response({'success': True, 'message': 'User deleted successfully'})


# ============================================================================
# Developer Views
# ============================================================================
class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.all().order_by('-createdAt')
    serializer_class = DeveloperSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUserRole()]

    def list(self, request, *args, **kwargs):
        developers = self.get_queryset()
        serializer = self.get_serializer(developers, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        lookup = kwargs.get('pk')
        dev = Developer.objects.filter(Q(id=lookup) | Q(slug=lookup)).first()
        if not dev:
            return Response({'success': False, 'message': 'Developer not found'}, status=404)
        serializer = self.get_serializer(dev)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        slug = request.data.get('slug')
        if slug and Developer.objects.filter(slug=slug).exists():
            return Response({'success': False, 'message': 'Slug already in use'}, status=400)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dev = serializer.save()
        return Response({'success': True, 'data': DeveloperSerializer(dev).data}, status=201)

    def update(self, request, *args, **kwargs):
        dev = self.get_object()
        slug = request.data.get('slug')
        if slug and Developer.objects.filter(slug=slug).exclude(id=dev.id).exists():
            return Response({'success': False, 'message': 'Slug already in use by another developer'}, status=400)

        serializer = self.get_serializer(dev, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_dev = serializer.save()
        return Response({'success': True, 'data': DeveloperSerializer(updated_dev).data})

    def destroy(self, request, *args, **kwargs):
        dev = self.get_object()
        dev.delete()
        return Response({'success': True, 'message': 'Developer deleted successfully'})


# ============================================================================
# Property Views
# ============================================================================
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.select_related('developerId').all().order_by('-createdAt')
    serializer_class = PropertySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUserRole()]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        developer_id = request.query_params.get('developerId')
        prop_type = request.query_params.get('type')
        prop_status = request.query_params.get('status')
        city = request.query_params.get('city')

        if developer_id:
            qs = qs.filter(developerId_id=developer_id)
        if prop_type:
            qs = qs.filter(type=prop_type)
        if prop_status:
            qs = qs.filter(status=prop_status)
        if city:
            qs = qs.filter(city__iexact=city)

        serializer = self.get_serializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        lookup = kwargs.get('pk')
        prop = Property.objects.select_related('developerId').filter(Q(id=lookup) | Q(slug=lookup)).first()
        if not prop:
            return Response({'success': False, 'message': 'Property not found'}, status=404)
        serializer = self.get_serializer(prop)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        dev_id = request.data.get('developerId')
        if not Developer.objects.filter(id=dev_id).exists():
            return Response({'success': False, 'message': 'Developer not found'}, status=404)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prop = serializer.save()
        return Response({'success': True, 'data': PropertySerializer(prop).data}, status=201)

    def update(self, request, *args, **kwargs):
        prop = self.get_object()
        dev_id = request.data.get('developerId')
        if dev_id and not Developer.objects.filter(id=dev_id).exists():
            return Response({'success': False, 'message': 'Developer not found'}, status=404)

        serializer = self.get_serializer(prop, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_prop = serializer.save()
        return Response({'success': True, 'data': PropertySerializer(updated_prop).data})

    def destroy(self, request, *args, **kwargs):
        prop = self.get_object()
        prop.delete()
        return Response({'success': True, 'message': 'Property deleted successfully'})


# ============================================================================
# Event Views
# ============================================================================
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('startDate')
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUserRole()]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        event_type = request.query_params.get('type')
        event_status = request.query_params.get('status')

        if event_type:
            qs = qs.filter(type=event_type)
        if event_status:
            qs = qs.filter(status=event_status)

        serializer = self.get_serializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        lookup = kwargs.get('pk')
        event = Event.objects.filter(Q(id=lookup) | Q(slug=lookup)).first()
        if not event:
            return Response({'success': False, 'message': 'Event not found'}, status=404)
        serializer = self.get_serializer(event)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        slug = request.data.get('slug')
        if slug and Event.objects.filter(slug=slug).exists():
            return Response({'success': False, 'message': 'Slug already in use'}, status=400)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()
        return Response({'success': True, 'data': EventSerializer(event).data}, status=201)

    def update(self, request, *args, **kwargs):
        event = self.get_object()
        slug = request.data.get('slug')
        if slug and Event.objects.filter(slug=slug).exclude(id=event.id).exists():
            return Response({'success': False, 'message': 'Slug already in use by another event'}, status=400)

        serializer = self.get_serializer(event, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({'success': True, 'data': EventSerializer(updated).data})

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        event.delete()
        return Response({'success': True, 'message': 'Event deleted successfully'})


# ============================================================================
# Lead Views
# ============================================================================
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.select_related('propertyId', 'eventId').all().order_by('-createdAt')
    serializer_class = LeadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        if self.action == 'destroy':
            return [IsAuthenticatedAtoIUser(), IsAdminUserRole()]
        return [IsAuthenticatedAtoIUser()]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        lead_status = request.query_params.get('status')
        source = request.query_params.get('source')

        if lead_status:
            qs = qs.filter(status=lead_status)
        if source:
            qs = qs.filter(source=source)

        serializer = self.get_serializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        lead = self.get_object()
        serializer = self.get_serializer(lead)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        created_at_val = data.get('createdAt') or data.get('date')
        prop_id = data.get('propertyId')
        if prop_id:
            # Check if UUID or slug
            uuid_regex = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            if not re.match(uuid_regex, str(prop_id), re.IGNORECASE):
                prop = Property.objects.filter(slug=prop_id).first()
                if prop:
                    data['propertyId'] = prop.id
                else:
                    data['propertyId'] = None

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        if created_at_val:
            try:
                from django.utils.dateparse import parse_datetime
                dt = parse_datetime(str(created_at_val))
                if dt:
                    Lead.objects.filter(id=lead.id).update(createdAt=dt)
                    lead.refresh_from_db()
            except Exception:
                pass
        return Response({
            'success': True,
            'message': 'Lead submitted successfully',
            'data': LeadSerializer(lead).data
        }, status=201)

    def update(self, request, *args, **kwargs):
        lead = self.get_object()
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        created_at_val = data.get('createdAt') or data.get('date')
        prop_id = data.get('propertyId')
        if prop_id:
            uuid_regex = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            if not re.match(uuid_regex, str(prop_id), re.IGNORECASE):
                prop = Property.objects.filter(slug=prop_id).first()
                if prop:
                    data['propertyId'] = prop.id
                else:
                    data['propertyId'] = None

        serializer = self.get_serializer(lead, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        if created_at_val:
            try:
                from django.utils.dateparse import parse_datetime
                dt = parse_datetime(str(created_at_val))
                if dt:
                    Lead.objects.filter(id=updated.id).update(createdAt=dt)
                    updated.refresh_from_db()
            except Exception:
                pass
        return Response({'success': True, 'data': LeadSerializer(updated).data})

    @action(detail=True, methods=['put'], url_path='status')
    def update_status(self, request, pk=None):
        lead = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response({'success': False, 'message': 'Status is required'}, status=400)
        lead.status = new_status
        lead.save(update_fields=['status'])
        return Response({'success': True, 'data': LeadSerializer(lead).data})

    def destroy(self, request, *args, **kwargs):
        lead = self.get_object()
        lead.delete()
        return Response({'success': True, 'message': 'Lead deleted successfully'})


# ============================================================================
# Testimonial Views
# ============================================================================
class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all().order_by('-createdAt')
    serializer_class = TestimonialSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticatedAtoIUser(), IsAdminUserRole()]

    def list(self, request, *args, **kwargs):
        testimonials = self.get_queryset()
        serializer = self.get_serializer(testimonials, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        t = self.get_object()
        serializer = self.get_serializer(t)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        t = serializer.save()
        return Response({'success': True, 'data': TestimonialSerializer(t).data}, status=201)

    def update(self, request, *args, **kwargs):
        t = self.get_object()
        serializer = self.get_serializer(t, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({'success': True, 'data': TestimonialSerializer(updated).data})

    def destroy(self, request, *args, **kwargs):
        t = self.get_object()
        t.delete()
        return Response({'success': True, 'message': 'Testimonial deleted successfully'})


# ============================================================================
# Property Submission Views
# ============================================================================
class PropertySubmissionViewSet(viewsets.ModelViewSet):
    queryset = PropertySubmission.objects.all().order_by('-createdAt')
    serializer_class = PropertySubmissionSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticatedAtoIUser(), IsAdminUserRole()]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        sub_status = request.query_params.get('status')
        search = request.query_params.get('search')

        if sub_status and sub_status != 'all':
            qs = qs.filter(status=sub_status)

        if search:
            qs = qs.filter(
                Q(ownerName__icontains=search) |
                Q(ownerEmail__icontains=search) |
                Q(ownerPhone__icontains=search) |
                Q(location__icontains=search)
            )

        serializer = self.get_serializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        sub = self.get_object()
        serializer = self.get_serializer(sub)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        owner_name = request.data.get('ownerName')
        owner_phone = request.data.get('ownerPhone')
        property_type = request.data.get('propertyType')
        location = request.data.get('location')

        if not owner_name or not owner_phone or not property_type or not location:
            return Response(
                {'success': False, 'message': 'Owner name, phone, property type, and location are required'},
                status=400
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()

        # Auto-create lead for unified CRM tracking
        try:
            Lead.objects.create(
                name=owner_name,
                email=request.data.get('ownerEmail') or None,
                phone=owner_phone,
                source='Website',
                status='New',
                interest=f"Owner Listing ({property_type})",
                purpose=request.data.get('purpose', 'Sell'),
                location=location,
                budget=request.data.get('expectedPrice') or None,
                message=f"Property Registration: {request.data.get('description') or 'Owner submitted property for listing'}"
            )
        except Exception:
            pass

        return Response({
            'success': True,
            'message': 'Property listing submitted successfully! Our team will review it.',
            'data': PropertySubmissionSerializer(submission).data
        }, status=201)

    def update(self, request, *args, **kwargs):
        sub = self.get_object()
        serializer = self.get_serializer(sub, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({
            'success': True,
            'message': 'Submission updated successfully',
            'data': PropertySubmissionSerializer(updated).data
        })

    def destroy(self, request, *args, **kwargs):
        sub = self.get_object()
        sub.delete()
        return Response({'success': True, 'message': 'Submission deleted successfully'})

    @action(detail=True, methods=['post'], url_path='convert')
    def convert(self, request, pk=None):
        submission = self.get_object()
        developer_id = request.data.get('developerId')
        name = request.data.get('name')
        price_range = request.data.get('priceRange')
        cover_image = request.data.get('coverImage')

        if not developer_id:
            first_dev = Developer.objects.first()
            if not first_dev:
                return Response({'success': False, 'message': 'Please provide or create a Developer first'}, status=400)
            dev_id = first_dev.id
        else:
            dev_id = developer_id

        prop_name = name or f"{submission.propertyType} at {submission.location}"
        slug_base = re.sub(r'[^a-z0-9]+', '-', prop_name.lower()).strip('-')
        slug = f"{slug_base}-{str(int(datetime.now().timestamp()))[-4:]}"

        valid_types = ['Residential', 'Commercial', 'Luxury', 'Land', 'Industries']
        p_type = submission.propertyType if submission.propertyType in valid_types else 'Residential'

        new_prop = Property.objects.create(
            name=prop_name,
            slug=slug,
            developerId_id=dev_id,
            type=p_type,
            city=submission.city or 'Bangalore',
            location=submission.location,
            priceRange=price_range or submission.expectedPrice or 'On Request',
            areaRangeSqFt=submission.areaSqFt or '1000 - 2000',
            configurations=['2 BHK', '3 BHK'],
            amenities=['24/7 Security', 'Power Backup'],
            highlights=['Verified Owner Listing', 'Direct Deal'],
            status='Ready_to_Move',
            description=submission.description or f"Verified listing by owner {submission.ownerName}",
            coverImage=cover_image or 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
            galleryImages=[],
        )

        submission.status = 'Listed'
        submission.notes = f"Converted to property: {new_prop.name} ({new_prop.id})"
        submission.save(update_fields=['status', 'notes'])

        return Response({
            'success': True,
            'message': 'Property created and published successfully!',
            'data': PropertySerializer(new_prop).data
        }, status=201)


# ============================================================================
# Career Views
# ============================================================================
class CareerViewSet(viewsets.ModelViewSet):
    queryset = Career.objects.all().order_by('-postedDate')
    serializer_class = CareerSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUserRole()]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        career_status = request.query_params.get('status')
        department = request.query_params.get('department')

        if career_status:
            qs = qs.filter(status=career_status)
        if department:
            qs = qs.filter(department=department)

        serializer = self.get_serializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        lookup = kwargs.get('pk')
        career = Career.objects.filter(Q(id=lookup) | Q(slug=lookup)).first()
        if not career:
            return Response({'success': False, 'message': 'Career not found'}, status=404)
        serializer = self.get_serializer(career)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get('postedDate'):
            data['postedDate'] = datetime.now(timezone.utc).isoformat()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        career = serializer.save()
        return Response({'success': True, 'data': CareerSerializer(career).data}, status=201)

    def update(self, request, *args, **kwargs):
        career = self.get_object()
        serializer = self.get_serializer(career, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({'success': True, 'data': CareerSerializer(updated).data})

    def destroy(self, request, *args, **kwargs):
        career = self.get_object()
        career.delete()
        return Response({'success': True, 'message': 'Career deleted successfully'})


# ============================================================================
# Job Application Views
# ============================================================================
class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.select_related('careerId').all().order_by('-createdAt')
    serializer_class = JobApplicationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticatedAtoIUser(), IsAdminUserRole()]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        career_id = request.query_params.get('careerId')
        app_status = request.query_params.get('status')

        if career_id:
            qs = qs.filter(careerId_id=career_id)
        if app_status:
            qs = qs.filter(status=app_status)

        serializer = self.get_serializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        app = self.get_object()
        serializer = self.get_serializer(app)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        target_career_id = request.data.get('careerId')
        career = Career.objects.filter(Q(id=target_career_id) | Q(slug=target_career_id)).first()
        if not career:
            return Response({'success': False, 'message': 'Target job position not found'}, status=404)

        resume_url = request.data.get('resumeUrl')
        resume_file = request.FILES.get('resume')

        if resume_file:
            ext = os.path.splitext(resume_file.name)[1]
            unique_name = f"resume_{uuid.uuid4()}{ext}"
            saved_path = default_storage.save(f"uploads/{unique_name}", ContentFile(resume_file.read()))
            resume_url = request.build_absolute_uri(settings.MEDIA_URL + unique_name)

        if not resume_url:
            return Response({'success': False, 'message': 'Resume file is required (.pdf, .doc, .docx)'}, status=400)

        app = JobApplication.objects.create(
            careerId=career,
            name=request.data.get('name', ''),
            email=request.data.get('email', ''),
            phone=request.data.get('phone', ''),
            linkedin=request.data.get('linkedin') or None,
            coverNote=request.data.get('coverNote') or None,
            resumeUrl=resume_url,
            status='Pending'
        )

        return Response({
            'success': True,
            'message': 'Application submitted successfully',
            'data': JobApplicationSerializer(app).data
        }, status=201)

    def update(self, request, *args, **kwargs):
        app = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            app.status = new_status
            app.save(update_fields=['status'])
        return Response({'success': True, 'data': JobApplicationSerializer(app).data})

    @action(detail=True, methods=['put'], url_path='status')
    def update_status(self, request, pk=None):
        app = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response({'success': False, 'message': 'Status is required'}, status=400)
        app.status = new_status
        app.save(update_fields=['status'])
        return Response({'success': True, 'data': JobApplicationSerializer(app).data})

    def destroy(self, request, *args, **kwargs):
        app = self.get_object()
        app.delete()
        return Response({'success': True, 'message': 'Application deleted successfully'})


# ============================================================================
# Content Views
# ============================================================================
class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all().order_by('-publishDate')
    serializer_class = ContentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUserRole()]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        content_type = request.query_params.get('type')
        content_status = request.query_params.get('status')

        if content_type:
            qs = qs.filter(type=content_type)
        if content_status:
            qs = qs.filter(status=content_status)

        serializer = self.get_serializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        lookup = kwargs.get('pk')
        content = Content.objects.filter(Q(id=lookup) | Q(slug=lookup)).first()
        if not content:
            return Response({'success': False, 'message': 'Content not found'}, status=404)
        serializer = self.get_serializer(content)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get('publishDate'):
            data['publishDate'] = datetime.now(timezone.utc).isoformat()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        c = serializer.save()
        return Response({'success': True, 'data': ContentSerializer(c).data}, status=201)

    def update(self, request, *args, **kwargs):
        c = self.get_object()
        serializer = self.get_serializer(c, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({'success': True, 'data': ContentSerializer(updated).data})

    def destroy(self, request, *args, **kwargs):
        c = self.get_object()
        c.delete()
        return Response({'success': True, 'message': 'Content deleted successfully'})


# ============================================================================
# Upload Views
# ============================================================================
class UploadView(views.APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, upload_type='image'):
        if upload_type == 'image':
            uploaded_file = next(iter(request.FILES.values()), None)
            if not uploaded_file:
                return Response({'success': False, 'message': 'No file provided'}, status=400)

            ext = os.path.splitext(uploaded_file.name)[1]
            unique_name = f"img_{uuid.uuid4()}{ext}"
            file_path = os.path.join(settings.MEDIA_ROOT, unique_name)

            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            file_url = request.build_absolute_uri(settings.MEDIA_URL + unique_name)

            return Response({
                'success': True,
                'message': 'File uploaded successfully',
                'data': {'url': file_url},
                'fileUrl': file_url,
                'url': file_url
            })

        elif upload_type == 'images':
            files = request.FILES.getlist('images')
            if not files:
                return Response({'success': False, 'message': 'No files provided'}, status=400)

            urls = []
            for f in files:
                ext = os.path.splitext(f.name)[1]
                unique_name = f"img_{uuid.uuid4()}{ext}"
                file_path = os.path.join(settings.MEDIA_ROOT, unique_name)
                with open(file_path, 'wb+') as destination:
                    for chunk in f.chunks():
                        destination.write(chunk)
                urls.append(request.build_absolute_uri(settings.MEDIA_URL + unique_name))

            return Response({
                'success': True,
                'message': 'Files uploaded successfully',
                'data': {'urls': urls}
            })

        return Response({'success': False, 'message': 'Invalid upload endpoint'}, status=400)
