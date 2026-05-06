import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { login } from '../services/authService';
import medivetLogo from '../assets/medivetlogobig.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Todos los campos son obligatorios');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data = await login(email, password);
      // Lógica de redirección por perfil (Requirement R.1)
      toast.success('¡Autenticación exitosa!');
      if (data.rol === 'Administrativo' || data.rol === 'Veterinario') {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard-user');
      }
    } catch (error) {
      toast.error(error?.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#9cd2c3] flex items-center justify-center p-4">

      {/* Tarjeta Blanca Central */}
      <div className="bg-white w-full max-w-[800px] rounded-xl pt-[140px] pb-16 px-8 flex flex-col items-center relative shadow-lg mt-16">

        {/* Logo que sobresale */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-xl py-4 px-8 shadow-[0_4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center w-full max-w-[420px]">
          <img
            src={medivetLogo}
            alt="MediVet"
            className="w-full h-auto object-contain max-h-[140px]"
          />
        </div>

        {/* Mensaje de Bienvenida */}
        <div className="text-center mb-10">
          <h1 className="text-[#0c3a6f] text-[26px] font-bold mb-1">
            Bienvenid@!
          </h1>
          <h2 className="text-[#0c3a6f] text-[22px] font-bold">
            Ingresa tus datos para empezar
          </h2>
        </div>

        {/* Formulario */}
        <form className="w-full max-w-[460px] flex flex-col gap-6" onSubmit={handleLogin} noValidate>

          {/* Bloque de Email */}
          <div className="flex flex-col w-full">
            <label className="text-black text-[15px] mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full h-[50px] bg-[#dcdcdc] px-4 outline-none border-none text-lg focus:ring-2 focus:ring-[#9cd2c3] transition-all disabled:opacity-60"
            />
          </div>

          {/* Bloque de Contraseña */}
          <div className="flex flex-col w-full">
            <label className="text-black text-[15px] mb-1 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full h-[50px] bg-[#dcdcdc] px-4 outline-none border-none text-lg focus:ring-2 focus:ring-[#9cd2c3] transition-all disabled:opacity-60"
            />
          </div>

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[54px] mt-6 bg-[#0c3a6f] text-white text-lg font-bold rounded-2xl shadow-md hover:bg-[#092b52] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
