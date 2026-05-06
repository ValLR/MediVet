from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, DuenoViewSet, PacienteViewSet, 
    CitaViewSet, FichaClinicaViewSet, RecetaViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'duenos', DuenoViewSet)
router.register(r'pacientes', PacienteViewSet)
router.register(r'citas', CitaViewSet)
router.register(r'fichas', FichaClinicaViewSet)
router.register(r'recetas', RecetaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
