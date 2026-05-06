import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medivet.settings')
django.setup()

from core.models import Usuario

try:
    user = Usuario.objects.get(email='a.iturra@medivet.cl')
    user.set_password('admin123')
    user.save()
    print("Contraseña actualizada para a.iturra@medivet.cl")
except Exception as e:
    print("Error:", e)
