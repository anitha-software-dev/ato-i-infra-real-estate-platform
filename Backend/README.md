# AtoI Infra - Django REST Framework Backend

This is the Python / Django REST Framework (DRF) backend conversion for the **AtoI Infra** PropTech Marketplace & CRM system, replacing the original Node.js/Express backend while keeping 100% compatibility with the existing PostgreSQL database, the Next.js Frontend (`localhost:3001`), and the Next.js Admin Panel (`localhost:3000`).

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+ (Current: Python 3.11.3)
- PostgreSQL running on `localhost:5432` with database `atoi_infra`

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Verify Database & APIs
You can run the automated verification test suite:
```bash
python test_api.py
python test_advanced.py
```

### 4. Run the Development Server
Run on port **5000** so that the frontend and admin panel connect without any configuration changes:
```bash
python manage.py runserver 5000
```
or bind to all interfaces:
```bash
python manage.py runserver 0.0.0.0:5000
```

The server will be live at:
`http://localhost:5000/api/v1/`

---

## 🛠️ Architecture Highlights

- **Direct PostgreSQL Mapping**: Connects to the existing `atoi_infra` database and maps cleanly to all 12 pre-existing tables (`User`, `Developer`, `Property`, `Event`, `Lead`, `Career`, `JobApplication`, `Content`, `Otp`, `ActivityLog`, `Testimonial`, `PropertySubmission`) with zero data loss or table duplication.
- **Identical JSON Envelope**: DRF `EnvelopeJSONRenderer` standardizes responses to `{ "success": true, "data": ... }` matching Express responses.
- **Zero-Friction Authentication**:
  - Passwords hashed and compared via `bcrypt` (10 rounds). Existing user accounts (e.g., `admin@atoi.com` / `123456`) authenticate out of the box.
  - JWT tokens encoded with `PyJWT` using the same HS256 secret key and `{ id, role }` claims.
- **Dual-Style URL Matching**: `OptionalSlashRouter` transparently supports requests both with and without trailing slashes (`/api/v1/properties` and `/api/v1/properties/`).
- **File & Media Storage**: Uploads (`/api/v1/upload/image`, `/api/v1/upload/images`, and job resume submissions) are stored in `uploads/` and served at `/uploads/<filename>`.

---

## 📋 API Route Summary

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/v1/health` | GET | Public | Health check |
| `/api/v1/auth/login` | POST | Public | Admin & user login |
| `/api/v1/auth/register` | POST | Admin / Bootstrap | Locked down once admin exists; HTTP 403 Forbidden for public |
| `/api/v1/auth/me` | GET | Authenticated | Current user profile |
| `/api/v1/auth/profile` | PUT | Authenticated | Update user profile |
| `/api/v1/auth/password` | PUT | Authenticated | Change password |
| `/api/v1/auth/send-otp` | POST | Public | Send verification OTP |
| `/api/v1/auth/verify-otp` | POST | Public | Verify OTP code |
| `/api/v1/users` | GET, POST | Admin Only | User management (secured with IsAdminUserRole) |
| `/api/v1/users/<id>` | GET, PUT, DELETE | Admin Only | User management (secured with IsAdminUserRole) |
| `/api/v1/users/activities` | GET | Admin Only | Audit log trail |
| `/api/v1/properties` | GET, POST | Public / Admin | List with filters, create |
| `/api/v1/properties/<id_or_slug>` | GET, PUT, DELETE | Public / Admin | Property detail by UUID or slug |
| `/api/v1/developers` | GET, POST | Public / Admin | Developers directory & create |
| `/api/v1/developers/<id_or_slug>` | GET, PUT, DELETE | Public / Admin | Developer detail with properties |
| `/api/v1/events` | GET, POST | Public / Admin | Events directory & create |
| `/api/v1/events/<id_or_slug>` | GET, PUT, DELETE | Public / Admin | Event detail with leads |
| `/api/v1/leads` | GET, POST | Admin / Public | Submit lead & CRM list |
| `/api/v1/leads/<id>/status` | PUT | Admin | Update lead lifecycle status |
| `/api/v1/testimonials` | GET, POST | Public / Authenticated | Testimonial management |
| `/api/v1/property-submissions` | GET, POST | Admin / Public | Submit owner property listing |
| `/api/v1/property-submissions/<id>/convert` | POST | Admin | Convert owner listing to property |
| `/api/v1/careers` | GET, POST | Public / Admin | Job openings |
| `/api/v1/careers/<id_or_slug>` | GET, PUT, DELETE | Public / Admin | Job opening detail |
| `/api/v1/job-applications` | GET, POST | Admin / Public | Apply with resume upload |
| `/api/v1/job-applications/<id>/status` | PUT | Admin | Review job application |
| `/api/v1/content` | GET, POST | Public / Admin | Blog & news content |
| `/api/v1/upload/image` | POST | Admin | Single image upload |
| `/api/v1/upload/images` | POST | Admin | Multiple image upload |

---

## 👥 How to Add Staff Going Forward

When a new team member joins your company (e.g. sales agent, property coordinator):
1. **Log in** with your Super Admin account (`admin@atoi.com`).
2. **Navigate** to Users Management (`/users`).
3. **Click** the green **"Add User"** button.
4. **Enter** their name, email, role (`USER` or `ADMIN`), status, and temporary password.
5. **Provide** those credentials to the staff member directly.
