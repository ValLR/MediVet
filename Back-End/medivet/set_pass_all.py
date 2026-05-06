import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medivet.settings')
django.setup()

from core.models import Usuario, Dueno

# 1. Reset password for c.soto@medivet.cl
try:
    user_vet = Usuario.objects.get(email='c.soto@medivet.cl')
    user_vet.set_password('vet123')
    user_vet.save()
    print("Contraseña de c.soto@medivet.cl actualizada a 'vet123'")
except Exception as e:
    print("Error actualizando c.soto:", e)

# 2. Create/update Usuario for javi.alarcon@gmail.com and link to Dueno
try:
    # First get the Dueno
    dueno = Dueno.objects.get(email='javi.alarcon@gmail.com')
    
    # Try to get or create the Usuario
    user_dueno, created = Usuario.objects.get_or_create(
        email='javi.alarcon@gmail.com',
        defaults={
            'username': dueno.nombre,
            'rol': Usuario.Rol.DUENO
        }
    )
    user_dueno.set_password('user123')
    user_dueno.save()
    
    # Link them
    dueno.usuario = user_dueno
    dueno.save()
    
    if created:
        print("Usuario Dueño creado y contraseña seteada a 'user123' para javi.alarcon@gmail.com")
    else:
        print("Contraseña de Dueño javi.alarcon@gmail.com actualizada a 'user123'")
except Exception as e:
    print("Error procesando a Javiera:", e)
