from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario, Dueno, Paciente, Cita, FichaClinica, Receta

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Añadir claims personalizados
        token['rol'] = user.rol
        token['nombre_completo'] = f"{user.first_name} {user.last_name}".strip() or user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Añadir campos extra a la respuesta JSON
        data['rol'] = self.user.rol
        data['nombre_completo'] = f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
        data['user_id'] = self.user.id
        return data

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rol', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user

class DuenoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dueno
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    dueno_detalle = DuenoSerializer(source='dueno', read_only=True)

    class Meta:
        model = Paciente
        fields = '__all__'

class CitaSerializer(serializers.ModelSerializer):
    paciente_detalle = PacienteSerializer(source='paciente', read_only=True)
    veterinario_detalle = UsuarioSerializer(source='veterinario', read_only=True)

    class Meta:
        model = Cita
        fields = '__all__'

    def validate_paciente(self, value):
        request = self.context.get('request')
        if request and hasattr(request.user, 'rol') and request.user.rol == 'Dueno':
            if value.dueno.usuario != request.user:
                raise serializers.ValidationError("No puede agendar una cita para un paciente que no le pertenece.")
        return value

class RecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receta
        fields = '__all__'

class FichaClinicaSerializer(serializers.ModelSerializer):
    recetas = RecetaSerializer(many=True, read_only=True)
    paciente_detalle = PacienteSerializer(source='paciente', read_only=True)
    veterinario_detalle = UsuarioSerializer(source='veterinario', read_only=True)

    class Meta:
        model = FichaClinica
        fields = '__all__'
