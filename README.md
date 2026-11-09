# AtoI Infra — Real Estate Platform & CRM

[![Stack](https://img.shields.io/badge/Stack-Next.js%2016%20%7C%20Django%205%20%7C%20PostgreSQL-blue)](https://github.com/anitha-software-dev)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

A comprehensive PropTech marketplace and customer relationship management (CRM) ecosystem. **AtoI Infra** delivers a modern, high-performance real estate portal for property buyers and sellers, coupled with an administrative CRM dashboard for real estate agents and team administrators, all backed by a secure Django REST Framework service.

---

## 🚀 Live Demos

| Service | Live Demo Link | Description |
|---|---|---|
| 🌐 **Customer Website** | [ato-i-infra-frontend.vercel.app](https://ato-i-infra-frontend.vercel.app/) | Public real estate discovery portal |
| 🛡️ **Admin CRM Dashboard** | [ato-i-infra-admin-panel.vercel.app](https://ato-i-infra-admin-panel.vercel.app/) | Agent & property management dashboard |
| ⚙️ **Backend REST API** | [atoi-infra-backend.onrender.com/api/v1](https://atoi-infra-backend.onrender.com/api/v1) | Django REST Framework API service |

---

## 🌟 Architecture & Component Overview

```
                                  +-----------------------------+
                                  |     PostgreSQL Database     |
                                  +--------------+--------------+
                                                 |
                                                 | (Port 5432)
                                                 v
                                  +-----------------------------+
                                  |       Backend Service       |
                                  |   (Django REST Framework)   |
                                  |          Port: 8000         |
                                  +------+---------------+------+
                                         |               |
                    REST APIs / JSON     |               |     REST APIs / JSON
                    Bearer JWT Auth      |               |     Bearer JWT Auth
                                         v               v
                   +-----------------------+   +-----------------------+
                   |    Admin Dashboard    |   |   Customer Website    |
                   |   (Next.js 16 / UI)   |   |   (Next.js 16 / Web)  |
                   |       Port: 3000      |   |       Port: 3001      |
                   +-----------------------+   +-----------------------+
```

---

## ✨ Key Features

### 1. 🌐 Customer-Facing Frontend (`Frontend`)
- **Property Discovery & Search**: Fast search and multifaceted filtering by city, BHK, price range, property status, and developer.
- **Project & Builder Showcases**: Rich property detail views, image galleries, builder profiles, and floor plan highlights.
- **Interactive Enquiries**: Instant enquiry modals with SMS OTP verification flow.
- **Owner Property Registration**: Self-service property listing submission portal for property owners.
- **Careers & Job Application**: Interactive career portal where job seekers can browse open positions and submit applications with resume uploads.
- **Responsive UI/UX**: Fluid animations powered by Framer Motion, modern typography, and Tailwind CSS.

### 2. 🛡️ Administrative CRM Dashboard (`Admin-Panel`)
- **Lead & Inquiry CRM**: Real-time management of customer inquiries, status updates (New, Contacted, In Progress, Closed), and one-click Excel data export.
- **Property Catalog Management**: Full CRUD capabilities for residential and commercial listings, price details, amenities, and image uploads.
- **Developer Profiles**: Manage builder companies, company logos, contact information, and associated property developments.
- **Job Vacancies & Application Tracking**: Create and update career openings; review and download applicant resumes.
- **Role-Based Access Control (RBAC)**: Secure multi-tier authentication (`ADMIN` vs `USER` staff roles) with strict permission guards.
- **Audit & Activity Logs**: Track administrative actions and timeline changes across the system.
- **Analytics & Metrics**: Visual overview charts built with Recharts.

### 3. ⚙️ Backend API Service (`Backend`)
- **RESTful Endpoints**: Standardized JSON envelope format `{ "success": true, "data": ... }`.
- **Zero-Trust Security**: Bcrypt password hashing, PyJWT authentication tokens, and route-level authorization guards.
- **Bootstrap Protection**: Public user registration automatically closes once an administrator account is initialized.
- **Media & Document Storage**: Handles image processing, document storage, and multi-part form uploads.
- **Dual-Style Routing**: Supports requests transparently with or without trailing slashes.
- **Test Suite**: Automated security verification tests (`verify_security.py`).

---

## 💻 Tech Stack

| Component | Framework / Library | Description |
|---|---|---|
| **Frontend Website** | Next.js 16 (App Router), React 19, TypeScript | High-performance customer portal |
| | Tailwind CSS v4, Framer Motion | Modern styling and smooth transitions |
| | Axios, React Hot Toast | API client and toast notifications |
| **Admin Panel** | Next.js 16, React 19, TypeScript | Administration & CRM interface |
| | Radix UI, Lucide Icons, Shadcn | Accessible UI primitives and components |
| | Recharts, React Hook Form, Zod, XLSX | Data visualization, validation, Excel export |
| **Backend API** | Python 3.11+, Django 5.0+, Django REST Framework | Scalable REST API architecture |
| | PostgreSQL, psycopg2-binary | Primary relational database |
| | PyJWT, bcrypt, Pillow | Security tokens, hashing, and media handling |

---

## 📁 Project Structure

```
AtoIInfra/
├── Admin-Panel/                 # Next.js 16 Admin Dashboard & CRM
│   ├── src/
│   │   ├── app/                 # Next.js App Router (auth, dashboard, leads, properties)
│   │   ├── components/          # Reusable dashboard widgets, tables, inputs
│   │   ├── hooks/               # State and data fetching hooks (useData, etc.)
│   │   └── lib/                 # Utilities and API clients
│   ├── public/                  # Static assets and icons
│   ├── .env.example             # Admin environment template
│   ├── package.json             # Admin dependencies and scripts
│   └── tsconfig.json            # TypeScript configuration
│
├── Backend/                     # Django REST Framework API Service
│   ├── api/                     # DRF application modules
│   │   ├── authentication.py    # Custom PyJWT authentication & RBAC permissions
│   │   ├── models.py            # 12 Core business models (User, Property, Lead, etc.)
│   │   ├── renderers.py         # Standardized JSON envelope renderer
│   │   ├── serializers.py       # Model serializers and validators
│   │   ├── urls.py              # API endpoint routing
│   │   └── views.py             # ViewSets and business logic
│   ├── core/                    # Django project core settings and WSGI/ASGI
│   ├── uploads/                 # Local media upload directory (.gitkeep tracked)
│   ├── manage.py                # Django management script
│   ├── requirements.txt         # Python package dependencies
│   ├── verify_security.py       # Automated security & RBAC verification suite
│   └── .env.example             # Backend environment template
│
├── Frontend/                    # Next.js 16 Customer-Facing Website
│   ├── src/
│   │   ├── app/                 # Website pages (properties, developers, careers, etc.)
│   │   ├── components/          # UI components (navbar, footer, enquiry modals)
│   │   └── lib/                 # API connection layer
│   ├── public/                  # Public brand assets and property images
│   ├── .env.example             # Frontend environment template
│   ├── package.json             # Frontend dependencies and scripts
│   └── tsconfig.json            # TypeScript configuration
│
├── .env.example                 # Global environment variables reference
├── .gitignore                   # Root repository git ignore rules
├── package.json                 # Monorepo task orchestration scripts
├── run-backend.bat              # Windows batch launcher: Backend API (Port 8000)
├── run-django.bat               # Windows batch launcher: Backend API (Port 5000)
├── run-admin.bat                # Windows batch launcher: Admin Panel (Port 3000)
└── run-frontend.bat             # Windows batch launcher: Customer Website (Port 3001)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following runtimes and services are installed on your machine:
- **Node.js**: v18.x or higher (v20+ recommended)
- **Python**: v3.10+ (v3.11+ recommended)
- **PostgreSQL**: v14+ running locally or remotely

---

### 1. Backend Service Setup

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL credentials:
   ```env
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=atoi_infra
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your-random-secret-key
   PORT=8000
   ```

5. **Apply database migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Run security verification tests**:
   ```bash
   python verify_security.py
   ```

7. **Start the backend development server**:
   ```bash
   python manage.py runserver 8000
   ```
   The API will be live at `http://localhost:8000/api/v1/`.

---

### 2. Admin Panel Setup

1. **Navigate to the Admin-Panel directory**:
   ```bash
   cd Admin-Panel
   ```

2. **Install Node packages**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   Set the API endpoint:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Start the admin panel**:
   ```bash
   npm run dev
   ```
   The Admin Panel will be accessible at `http://localhost:3000`.

---

### 3. Customer Website Frontend Setup

1. **Navigate to the Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install Node packages**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   Set the API endpoint:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Start the website**:
   ```bash
   npm run dev
   ```
   The Frontend Website will be accessible at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied by Admin Panel).

---

## ⚡ Quick Start via Monorepo Scripts

From the repository root, you can conveniently start individual components using root npm scripts:

```bash
# Start Backend on Port 8000
npm run dev:backend

# Start Backend on Port 5000
npm run dev:backend:5000

# Start Admin Dashboard
npm run dev:admin

# Start Frontend Website
npm run dev:frontend
```

On **Windows**, double-click the included batch launcher files:
- `run-backend.bat`: Starts the Django API server on port 8000
- `run-admin.bat`: Starts the Admin Dashboard
- `run-frontend.bat`: Starts the Customer Website

---

## 🔒 Security Best Practices

- **No Secrets in Source Control**: All credentials, database passwords, and JWT secret keys are strictly excluded via `.gitignore`.
- **Environment Isolation**: Always generate unique values for `JWT_SECRET` in non-development environments.
- **CORS Protection**: Configure `CORS_ALLOWED_ORIGINS` in `Backend/core/settings.py` for staging and production domains.
- **Admin Bootstrapping**: Public user creation is automatically disabled once the first administrator account is created.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
