from django.db import migrations
from api.authentication import hash_password
import uuid

SQL_CREATE_TABLES = """
CREATE TABLE IF NOT EXISTS "Career" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "title" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "department" varchar(255) NOT NULL,
    "location" varchar(255) NOT NULL,
    "type" varchar(50) NOT NULL,
    "experienceLevel" varchar(100) NOT NULL,
    "salaryRange" varchar(100) NULL,
    "isUrgent" boolean NOT NULL DEFAULT false,
    "description" text NOT NULL,
    "responsibilities" text[] NOT NULL DEFAULT '{}',
    "requirements" text[] NOT NULL DEFAULT '{}',
    "niceToHave" text[] NOT NULL DEFAULT '{}',
    "benefits" text[] NOT NULL DEFAULT '{}',
    "status" varchar(50) NOT NULL DEFAULT 'Open',
    "postedDate" timestamp with time zone NOT NULL DEFAULT now(),
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Content" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "title" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "content" text NOT NULL,
    "excerpt" text NULL,
    "category" varchar(100) NULL,
    "readTime" varchar(50) NULL,
    "featuredImage" text NULL,
    "type" varchar(50) NOT NULL,
    "author" varchar(255) NOT NULL,
    "status" varchar(50) NOT NULL DEFAULT 'Draft',
    "publishDate" timestamp with time zone NOT NULL DEFAULT now(),
    "views" integer NOT NULL DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Developer" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "tagline" varchar(500) NOT NULL,
    "about" text NOT NULL,
    "foundedYear" integer NOT NULL,
    "hqCity" varchar(255) NOT NULL,
    "operatingCities" varchar(255)[] NOT NULL DEFAULT '{}',
    "experienceYears" integer NOT NULL,
    "completedProjects" integer NOT NULL,
    "ongoingProjects" integer NOT NULL,
    "totalUnits" integer NOT NULL,
    "rating" double precision NOT NULL,
    "reviewCount" integer NOT NULL,
    "logoUrl" text NOT NULL,
    "coverImageUrl" text NOT NULL,
    "awards" varchar(255)[] NOT NULL DEFAULT '{}',
    "status" varchar(50) NOT NULL DEFAULT 'Active',
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Event" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "title" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "tagline" varchar(500) NOT NULL,
    "description" text NOT NULL,
    "type" varchar(50) NOT NULL,
    "status" varchar(50) NOT NULL,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    "time" varchar(100) NOT NULL,
    "venueName" varchar(255) NOT NULL,
    "address" varchar(500) NOT NULL,
    "city" varchar(255) NOT NULL,
    "mode" varchar(50) NOT NULL,
    "coverImage" text NOT NULL,
    "galleryImages" varchar(500)[] NOT NULL DEFAULT '{}',
    "speakers" jsonb NOT NULL DEFAULT '[]',
    "highlights" varchar(255)[] NOT NULL DEFAULT '{}',
    "registrationLink" text NULL,
    "attendees" integer NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Otp" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "phone" varchar(50) NOT NULL UNIQUE,
    "code" varchar(10) NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "PropertySubmission" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "ownerName" varchar(255) NOT NULL,
    "ownerEmail" varchar(255) NOT NULL,
    "ownerPhone" varchar(50) NOT NULL,
    "propertyType" varchar(50) NOT NULL,
    "purpose" varchar(50) NOT NULL DEFAULT 'Sell',
    "city" varchar(255) NULL,
    "location" varchar(255) NOT NULL,
    "expectedPrice" varchar(100) NULL,
    "areaSqFt" varchar(100) NULL,
    "description" text NULL,
    "status" varchar(50) NOT NULL DEFAULT 'Pending_Review',
    "notes" text NULL,
    "assignedTo" varchar(255) NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "clientName" varchar(255) NOT NULL,
    "clientRole" varchar(255) NULL,
    "clientAvatar" text NULL,
    "rating" integer NOT NULL DEFAULT 5,
    "quote" text NOT NULL,
    "propertyName" varchar(255) NULL,
    "location" varchar(255) NULL,
    "isFeatured" boolean NOT NULL DEFAULT false,
    "status" varchar(50) NOT NULL DEFAULT 'Active',
    "type" varchar(50) NOT NULL DEFAULT 'CLIENT',
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL UNIQUE,
    "passwordHash" varchar(255) NOT NULL,
    "role" varchar(50) NOT NULL DEFAULT 'USER',
    "status" varchar(50) NOT NULL DEFAULT 'Active',
    "phone" varchar(50) NULL,
    "lastLoginAt" timestamp with time zone NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "JobApplication" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "careerId" varchar(64) NOT NULL,
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "phone" varchar(50) NOT NULL,
    "linkedin" varchar(500) NULL,
    "resumeUrl" text NOT NULL,
    "coverNote" text NULL,
    "status" varchar(50) NOT NULL DEFAULT 'Pending',
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Property" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "developerId" varchar(64) NOT NULL,
    "name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "type" varchar(50) NOT NULL,
    "city" varchar(255) NOT NULL,
    "location" varchar(255) NOT NULL,
    "priceRange" varchar(255) NOT NULL,
    "areaRangeSqFt" varchar(255) NOT NULL,
    "configurations" varchar(255)[] NOT NULL DEFAULT '{}',
    "amenities" varchar(255)[] NOT NULL DEFAULT '{}',
    "highlights" varchar(255)[] NOT NULL DEFAULT '{}',
    "status" varchar(50) NOT NULL,
    "description" text NOT NULL,
    "coverImage" text NOT NULL,
    "galleryImages" varchar(500)[] NOT NULL DEFAULT '{}',
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Lead" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "propertyId" varchar(64) NULL,
    "eventId" varchar(64) NULL,
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NULL,
    "phone" varchar(50) NOT NULL,
    "source" varchar(50) NOT NULL,
    "status" varchar(50) NOT NULL DEFAULT 'New',
    "interest" varchar(255) NULL,
    "purpose" varchar(100) NULL,
    "location" varchar(255) NULL,
    "budget" varchar(100) NULL,
    "message" text NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "ActivityLog" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "userId" varchar(64) NULL,
    "userName" varchar(255) NOT NULL,
    "userEmail" varchar(255) NOT NULL,
    "action" varchar(100) NOT NULL,
    "details" text NULL,
    "ipAddress" varchar(100) NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now()
);
"""

def seed_superadmin(apps, schema_editor):
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM "User" WHERE "role" = \'ADMIN\'')
        admin_count = cursor.fetchone()[0]
        if admin_count == 0:
            admin_id = str(uuid.uuid4())
            admin_pass_hash = hash_password('123456')
            cursor.execute(
                'INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "status", "createdAt", "updatedAt") '
                'VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW()) ON CONFLICT ("email") DO NOTHING',
                [admin_id, 'Super Admin', 'admin@atoi.com', admin_pass_hash, 'ADMIN', 'Active']
            )

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(SQL_CREATE_TABLES),
        migrations.RunPython(seed_superadmin, reverse_code=migrations.RunPython.noop),
    ]
