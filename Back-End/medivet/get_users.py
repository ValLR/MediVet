import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medivet.settings')
django.setup()

from core.models import Usuario
users = Usuario.objects.all()
for u in users:
    print(f"Email: {u.email} | Rol: {u.rol} | Passwords: password123 (asumido)")
