# GrowUp — Full Stack Website

> **Code. Connect. Deploy.**  
> Built with Django REST Framework + React + Tailwind CSS

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, React Router 6 |
| Backend | Django 4.2, Django REST Framework |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Styling | Tailwind CSS + Custom CSS |
| Forms | React Hook Form |
| HTTP | Axios |
| Deployment | Gunicorn + WhiteNoise |

---

## 📁 Project Structure

```
growup/
├── backend/                  # Django REST API
│   ├── growup_backend/       # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── api/                  # Main API app
│   │   ├── models.py         # Service, Project, Testimonial, Contact, etc.
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── manage.py
│   ├── seed_data.py          # Populate DB with sample data
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                 # React + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Services.jsx
    │   │   ├── Stats.jsx
    │   │   ├── TechStack.jsx
    │   │   ├── Testimonials.jsx
    │   │   ├── Contact.jsx
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ServicesPage.jsx
    │   │   ├── Portfolio.jsx
    │   │   ├── About.jsx
    │   │   └── ContactPage.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser (for admin panel)
python manage.py createsuperuser

# Load sample data
python manage.py shell < seed_data.py

# Start development server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`  
Admin panel: `http://localhost:8000/admin`  
API docs: `http://localhost:8000/api/`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | API overview |
| GET | `/api/services/` | List all services |
| GET | `/api/projects/` | List all projects |
| GET | `/api/projects/?category=web` | Filter projects by category |
| GET | `/api/projects/{slug}/` | Single project |
| GET | `/api/testimonials/` | List testimonials |
| GET | `/api/tech-stack/` | List technologies |
| GET | `/api/stats/` | Company stats |
| POST | `/api/contact/` | Submit contact form |

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Electric Blue | `#2563EB` | Primary |
| Neon Cyan | `#06B6D4` | Accent |
| Deep Purple | `#7C3AED` | Secondary |
| Dark Background | `#0F172A` | Background |
| Neon Green | `#22C55E` | Success |

---

## 🌐 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, Services overview, Stats, Tech Stack, Testimonials, Contact |
| `/services` | Services | Detailed services, Process, Why Us |
| `/portfolio` | Portfolio | Project grid with filters |
| `/about` | About | Company story, Team, Mission |
| `/contact` | Contact | Contact form + info |

---

## 🔧 Environment Variables

```env
# backend/.env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
CONTACT_EMAIL=hello@growup.dev
```

---

## 🚀 Production Deployment

### Backend (Gunicorn)
```bash
pip install gunicorn
gunicorn growup_backend.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Frontend (Build)
```bash
npm run build
# Outputs to dist/ — serve with Nginx or upload to CDN
```

### Recommended Stack
- **Frontend**: Vercel / Netlify / AWS S3 + CloudFront
- **Backend**: AWS EC2 / DigitalOcean / Railway
- **Database**: PostgreSQL (AWS RDS / Supabase)
- **Media**: AWS S3

---

## 📝 Admin Panel

Access at `/admin` with superuser credentials.

Manage:
- ✅ Services
- ✅ Projects (with featured toggle)
- ✅ Testimonials
- ✅ Contact Messages (with status workflow)
- ✅ Tech Stack
- ✅ Stats

---

## 🛠️ Extending the Project

### Add a new Project via Admin:
1. Go to `/admin/api/project/add/`
2. Fill in title, description, tech stack (JSON array), category
3. Toggle `is_featured` for homepage visibility

### Add Email Notifications:
Update `.env` with SMTP credentials and set `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`

---

*Built with ❤️ by GrowUp — Code. Connect. Deploy.*
