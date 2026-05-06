from django.test import TestCase
from .models import Usuario, Dueno, Paciente, Cita, FichaClinica, Receta

class BasicModelTest(TestCase):
    def setUp(self):
        # Crear Usuario
        self.usuario = Usuario.objects.create_user('vet1', 'vet1@example.com', 'pass')
        self.usuario.rol = Usuario.Rol.VETERINARIO
        self.usuario.save()

        # Crear Dueno
        self.dueno = Dueno.objects.create(rut='12345678-9', nombre='Juan Perez', telefono='123456789', email='[EMAIL_ADDRESS]')

        # Crear Paciente
        self.paciente = Paciente.objects.create(dueno=self.dueno, nombre='Bobby', especie='Perro', raza='Labrador')

    def test_usuario_creation(self):
        self.assertEqual(Usuario.objects.count(), 1)
        self.assertEqual(self.usuario.rol, Usuario.Rol.VETERINARIO)

    def test_dueno_creation(self):
        self.assertEqual(Dueno.objects.count(), 1)
        self.assertEqual(self.dueno.nombre, 'Juan Perez')

    def test_paciente_creation(self):
        self.assertEqual(Paciente.objects.count(), 1)
        self.assertEqual(self.paciente.dueno, self.dueno)

    def test_string_representation(self):
        self.assertEqual(str(self.dueno), 'Juan Perez')
        self.assertEqual(str(self.paciente), 'Bobby (Perro)')
