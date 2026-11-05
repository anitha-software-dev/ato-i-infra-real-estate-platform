"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()

# Automatically ensure migrations and default superadmin exist on server startup
def auto_bootstrap():
    try:
        from django.core.management import call_command
        call_command('migrate', interactive=False)
        from api.models import User
        from api.authentication import hash_password

        email = os.getenv('INITIAL_ADMIN_EMAIL', 'admin@atoi.com').strip().lower()
        password = os.getenv('INITIAL_ADMIN_PASSWORD', '123456')
        name = os.getenv('INITIAL_ADMIN_NAME', 'Super Admin')

        if not User.objects.filter(role='ADMIN').exists():
            User.objects.create(
                name=name,
                email=email,
                passwordHash=hash_password(password),
                role='ADMIN',
                status='Active'
            )
            print(f"[WSGI] Created initial Super Admin account: {email}")
        else:
            print("[WSGI] Admin account verified.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[WSGI Startup Error] {e}")

auto_bootstrap()
