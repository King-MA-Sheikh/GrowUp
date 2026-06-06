"""
Run with: python manage.py shell < seed_data.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'growup_backend.settings')
django.setup()

from api.models import Service, Testimonial, TechStack, Stat

# ─── Services ─────────────────────────────────────────────────────────────────
services_data = [
    {
        "title": "Web Development",
        "category": "web",
        "description": "Modern, responsive websites and web applications built with the latest technologies. From landing pages to complex SaaS platforms.",
        "icon": "Globe",
        "features": ["React / Next.js frontends", "Django / Node.js backends", "RESTful APIs", "SEO Optimized", "CMS Integration"],
        "order": 1,
    },
    {
        "title": "Mobile App Development",
        "category": "mobile",
        "description": "Native and cross-platform mobile applications for Android & iOS with polished UI/UX that users love.",
        "icon": "Smartphone",
        "features": ["React Native", "Android (Kotlin)", "iOS (Swift)", "Push Notifications", "Offline Support"],
        "order": 2,
    },
    {
        "title": "Full Stack Development",
        "category": "fullstack",
        "description": "End-to-end systems built with a unified architecture. Frontend, backend, database, and API — all crafted seamlessly.",
        "icon": "Layers",
        "features": ["Frontend + Backend", "Database Design", "API Architecture", "Authentication & Security", "Scalable Systems"],
        "order": 3,
    },
    {
        "title": "Networking Solutions",
        "category": "networking",
        "description": "Secure and scalable network infrastructure for businesses. LAN/WAN setup, VPN, firewalls, and monitoring.",
        "icon": "Network",
        "features": ["LAN / WAN Setup", "VPN Configuration", "Firewall & Security", "Network Monitoring", "ISP Integration"],
        "order": 4,
    },
    {
        "title": "Cloud & DevOps",
        "category": "cloud",
        "description": "Deploy, scale, and automate your infrastructure with modern cloud solutions. AWS, Docker, Kubernetes, and CI/CD pipelines.",
        "icon": "Cloud",
        "features": ["AWS Deployment", "Docker & Kubernetes", "CI/CD Pipelines", "VPS Management", "Auto Scaling"],
        "order": 5,
    },
]

for s in services_data:
    Service.objects.get_or_create(title=s["title"], defaults=s)

print("✓ Services seeded")

# ─── Testimonials ─────────────────────────────────────────────────────────────
testimonials_data = [
    {
        "client_name": "Arjun Mehta",
        "client_role": "Founder",
        "client_company": "TechNova Startup",
        "message": "GrowUp delivered our SaaS platform in record time. The code quality and design exceeded our expectations. Highly recommend for any startup!",
        "rating": 5,
    },
    {
        "client_name": "Priya Sharma",
        "client_role": "CTO",
        "client_company": "RetailEdge India",
        "message": "Our mobile app went from idea to Play Store in 6 weeks. The team at GrowUp is incredibly skilled and communicative throughout the process.",
        "rating": 5,
    },
    {
        "client_name": "Rahul Gupta",
        "client_role": "CEO",
        "client_company": "CloudBridge Solutions",
        "message": "The cloud migration handled by GrowUp saved us 40% in infrastructure costs. Their DevOps expertise is top-tier.",
        "rating": 5,
    },
    {
        "client_name": "Sneha Patel",
        "client_role": "Product Manager",
        "client_company": "FinTrack App",
        "message": "From UI design to backend APIs, everything was seamlessly integrated. GrowUp truly understands full-stack development.",
        "rating": 5,
    },
]

for t in testimonials_data:
    Testimonial.objects.get_or_create(client_name=t["client_name"], defaults=t)

print("✓ Testimonials seeded")

# ─── Tech Stack ───────────────────────────────────────────────────────────────
tech_data = [
    {"name": "React.js", "category": "Frontend", "order": 1},
    {"name": "Next.js", "category": "Frontend", "order": 2},
    {"name": "Tailwind CSS", "category": "Frontend", "order": 3},
    {"name": "Node.js", "category": "Backend", "order": 4},
    {"name": "Django", "category": "Backend", "order": 5},
    {"name": "Python", "category": "Backend", "order": 6},
    {"name": "AWS", "category": "Cloud", "order": 7},
    {"name": "Docker", "category": "DevOps", "order": 8},
    {"name": "Kubernetes", "category": "DevOps", "order": 9},
    {"name": "MySQL", "category": "Database", "order": 10},
    {"name": "MongoDB", "category": "Database", "order": 11},
    {"name": "PostgreSQL", "category": "Database", "order": 12},
]

for t in tech_data:
    TechStack.objects.get_or_create(name=t["name"], defaults=t)

print("✓ Tech Stack seeded")

# ─── Stats ────────────────────────────────────────────────────────────────────
stats_data = [
    {"label": "Projects Delivered", "value": "50", "suffix": "+", "icon": "Briefcase", "order": 1},
    {"label": "Happy Clients", "value": "40", "suffix": "+", "icon": "Users", "order": 2},
    {"label": "Years of Experience", "value": "3", "suffix": "+", "icon": "Award", "order": 3},
    {"label": "Technologies", "value": "15", "suffix": "+", "icon": "Code2", "order": 4},
]

for s in stats_data:
    Stat.objects.get_or_create(label=s["label"], defaults=s)

print("✓ Stats seeded")
print("\n🚀 All seed data loaded successfully!")
