import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions, permissions
from .models import User


def hash_password(password: str) -> str:
    """Hash password using bcrypt (10 rounds) matching Node.js backend."""
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def compare_password(password: str, hashed: str) -> bool:
    """Compare plaintext password against bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def generate_token(user: User) -> str:
    """Generate JWT token with payload matching Node.js { id: user.id, role: user.role }."""
    # expiresIn: 1d default
    exp = datetime.now(timezone.utc) + timedelta(days=1)
    payload = {
        'id': user.id,
        'role': user.role,
        'exp': exp,
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')
    return token


def verify_token(token: str) -> dict:
    """Verify and decode JWT token."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])


class AtoIJWTAuthentication(BaseAuthentication):
    """
    Custom JWT Authentication that extracts 'Bearer <token>',
    decodes payload, and attaches the User instance to request.user.
    """

    def authenticate_header(self, request):
        return 'Bearer'

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        parts = auth_header.split(' ')
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]
        try:
            payload = verify_token(token)
            user_id = payload.get('id')
            if not user_id:
                raise exceptions.AuthenticationFailed('Invalid token payload')

            user = User.objects.filter(id=user_id).first()
            if not user:
                raise exceptions.AuthenticationFailed('User not found')

            if user.status != 'Active':
                raise exceptions.AuthenticationFailed('User account is inactive')

            return (user, token)
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))


class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to authenticated users with role == 'ADMIN'.
    """
    message = 'Forbidden: Insufficient permissions. Administrator privileges required.'

    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'role', None) == 'ADMIN')


class IsAuthenticatedAtoIUser(permissions.BasePermission):
    """
    Allows access only to authenticated users.
    """
    message = 'Authentication required'

    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'id', None))
