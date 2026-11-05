import os
from django.core.management.base import BaseCommand
from django.core.management import call_command
from api.models import User
from api.authentication import hash_password

class Command(BaseCommand):
    help = 'Ensures database migrations are applied and the default Super Admin user exists.'

    def handle(self, *args, **options):
        self.stdout.write("Applying migrations...")
        try:
            call_command('migrate', interactive=False)
        except Exception as e:
            self.stderr.write(f"Migration error (continuing): {e}")

        email = os.getenv('INITIAL_ADMIN_EMAIL', 'admin@atoi.com').strip().lower()
        password = os.getenv('INITIAL_ADMIN_PASSWORD', '123456')
        name = os.getenv('INITIAL_ADMIN_NAME', 'Super Admin')

        existing_admin = User.objects.filter(email=email).first()
        if existing_admin:
            self.stdout.write(self.style.SUCCESS(f"Admin user already exists: {existing_admin.email}"))
            # Ensure admin has valid password and active status
            existing_admin.role = 'ADMIN'
            existing_admin.status = 'Active'
            existing_admin.save(update_fields=['role', 'status'])
        else:
            User.objects.create(
                name=name,
                email=email,
                passwordHash=hash_password(password),
                role='ADMIN',
                status='Active'
            )
            self.stdout.write(self.style.SUCCESS(f"Successfully created Super Admin user: {email} / {password}"))
