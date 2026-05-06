from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Dueno, Paciente, Cita, FichaClinica, Receta

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'is_staff')
    list_filter = ('rol', 'is_staff')
    search_fields = ('username', 'first_name', 'last_name', 'email')

    fieldsets = UserAdmin.fieldsets + (
        ('Información de Clínica', {'fields': ('rol',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información de Clínica', {'fields': ('rol',)}),
    )

@admin.register(Dueno)
class DuenoAdmin(admin.ModelAdmin):
    list_display = ('rut', 'nombre', 'telefono', 'email')
    search_fields = ('rut', 'nombre', 'email')
    list_filter = ('nombre',)

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'especie', 'raza', 'fecha_nacimiento', 'dueno')
    list_filter = ('especie', 'dueno')
    search_fields = ('nombre', 'raza')

@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'veterinario', 'fecha_hora_inicio', 'fecha_hora_fin', 'estado', 'motivo')
    list_filter = ('estado', 'veterinario', 'paciente')
    search_fields = ('paciente__nombre', 'veterinario__username', 'motivo')

@admin.register(FichaClinica)
class FichaClinicaAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'veterinario', 'fecha_atencion')
    list_filter = ('veterinario', 'paciente', 'fecha_atencion')
    search_fields = ('paciente__nombre', 'veterinario__username', 'diagnostico', 'tratamiento')

@admin.register(Receta)
class RecetaAdmin(admin.ModelAdmin):
    list_display = ('ficha', 'medicamentos_preview', 'indicaciones_preview')
    search_fields = ('ficha__paciente__nombre', 'medicamentos', 'indicaciones')
    list_filter = ('ficha__veterinario', 'ficha__paciente')

    def medicamentos_preview(self, obj):
        return obj.medicamentos[:50] + '...' if len(obj.medicamentos) > 50 else obj.medicamentos
    medicamentos_preview.short_description = 'Medicamentos'

    def indicaciones_preview(self, obj):
        return obj.indicaciones[:50] + '...' if len(obj.indicaciones) > 50 else obj.indicaciones
    indicaciones_preview.short_description = 'Indicaciones'
