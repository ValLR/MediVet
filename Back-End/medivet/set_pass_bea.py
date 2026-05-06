import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medivet.settings')
django.setup()

from core.models import Usuario

try:
    user = Usuario.objects.get(email='b.aravena@medivet.cl')
    user.set_password('vet123')
    user.save()
    print("Contraseña de b.aravena@medivet.cl actualizada a 'vet123'")
except Exception as e:
    print("Error:", e)
