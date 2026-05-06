from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Usuario, Dueno, Paciente, Cita, FichaClinica, Receta
from .serializers import (
    UsuarioSerializer, DuenoSerializer, PacienteSerializer, 
    CitaSerializer, FichaClinicaSerializer, RecetaSerializer,
    CustomTokenObtainPairSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class IsVeterinarioOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.rol == 'Veterinario'

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rol']

class DuenoViewSet(viewsets.ModelViewSet):
    queryset = Dueno.objects.all()
    serializer_class = DuenoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['rut', 'nombre', 'email']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', None) == 'Dueno':
            return Dueno.objects.filter(usuario=user)
        return super().get_queryset()

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['dueno', 'especie']
    search_fields = ['nombre']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', None) == 'Dueno':
            return Paciente.objects.filter(dueno__usuario=user)
        return super().get_queryset()

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['paciente', 'veterinario', 'estado']
    ordering_fields = ['fecha_hora_inicio']
    ordering = ['fecha_hora_inicio']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', None) == 'Dueno':
            return Cita.objects.filter(paciente__dueno__usuario=user)
        return super().get_queryset()

class FichaClinicaViewSet(viewsets.ModelViewSet):
    queryset = FichaClinica.objects.all()
    serializer_class = FichaClinicaSerializer
    permission_classes = [permissions.IsAuthenticated, IsVeterinarioOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['paciente', 'veterinario']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', None) == 'Dueno':
            return FichaClinica.objects.filter(paciente__dueno__usuario=user)
        return super().get_queryset()

class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer
    permission_classes = [permissions.IsAuthenticated, IsVeterinarioOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ficha']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', None) == 'Dueno':
            return Receta.objects.filter(ficha__paciente__dueno__usuario=user)
        return super().get_queryset()
