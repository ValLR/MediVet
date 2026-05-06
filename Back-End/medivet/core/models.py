from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        ADMINISTRATIVO = 'Administrativo', 'Administrativo'
        VETERINARIO = 'Veterinario', 'Veterinario'
        DUENO = 'Dueno', 'Dueño'

    rol = models.CharField(max_length=20, choices=Rol.choices, default=Rol.ADMINISTRATIVO)
    
    class Meta:
        db_table = 'usuarios'

class Dueno(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, null=True, blank=True, related_name='perfil_dueno')
    rut = models.CharField(max_length=12, unique=True)
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    email = models.EmailField(max_length=100, null=True, blank=True)
    direccion = models.CharField(max_length=200, null=True, blank=True)

    class Meta:
        db_table = 'duenos'

    def __str__(self):
        return self.nombre

class Paciente(models.Model):
    dueno = models.ForeignKey(Dueno, on_delete=models.CASCADE, db_column='id_dueno', related_name='pacientes')
    nombre = models.CharField(max_length=50)
    especie = models.CharField(max_length=50)
    raza = models.CharField(max_length=50, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'pacientes'

    def __str__(self):
        return f"{self.nombre} ({self.especie})"

class Cita(models.Model):
    class Estado(models.TextChoices):
        PROGRAMADA = 'Programada', 'Programada'
        COMPLETADA = 'Completada', 'Completada'
        CANCELADA = 'Cancelada', 'Cancelada'

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, db_column='id_paciente', related_name='citas')
    veterinario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_veterinario', related_name='citas_asignadas')
    fecha_hora_inicio = models.DateTimeField()
    fecha_hora_fin = models.DateTimeField()
    motivo = models.CharField(max_length=200)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PROGRAMADA)

    class Meta:
        db_table = 'citas'

class FichaClinica(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, db_column='id_paciente', related_name='fichas')
    veterinario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_veterinario', related_name='fichas_creadas')
    fecha_atencion = models.DateTimeField(auto_now_add=True)
    diagnostico = models.TextField()
    tratamiento = models.TextField()

    class Meta:
        db_table = 'fichas_clinicas'

class Receta(models.Model):
    ficha = models.ForeignKey(FichaClinica, on_delete=models.CASCADE, db_column='id_ficha', related_name='recetas')
    medicamentos = models.TextField()
    indicaciones = models.TextField()

    class Meta:
        db_table = 'recetas'
