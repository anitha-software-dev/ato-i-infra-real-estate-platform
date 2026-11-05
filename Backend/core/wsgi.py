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

# Automatically ensure database tables, migrations, and default superadmin exist on server startup
def auto_bootstrap():
    try:
        from django.core.management import call_command
        try:
            call_command('migrate', interactive=False)
        except Exception as e:
            print(f"[WSGI Migration Warning] {e}")

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

        # Load seed data if Property table is empty
        from api.models import Property
        if Property.objects.count() == 0:
            fixture_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'seed_data.json')
            if os.path.exists(fixture_path):
                try:
                    call_command('loaddata', fixture_path)
                    print("[WSGI] Successfully loaded initial dataset from seed_data.json!")
                except Exception as seed_err:
                    print(f"[WSGI Seed Notice] {seed_err}")
    except Exception as e:
        print(f"[WSGI Startup Notice] {e}")
    finally:
        # Crucial: Close all open database connections in the master process
        # so that forked Gunicorn worker processes do NOT inherit a closed or shared socket!
        try:
            from django.db import connections
            connections.close_all()
        except Exception:
            pass

auto_bootstrap()
