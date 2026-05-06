import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../services/api';

const DashboardAdmin = () => {
  const [citas, setCitas] = useState([]);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener nombre del usuario en sesión
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      const nameParts = userObj.nombre_completo ? userObj.nombre_completo.split(' ') : ['Administrador'];
      // Formatear "Bienvenida [Nombre] \n [Apellido]!" como en el diseño si es posible
      if (nameParts.length > 1) {
        setUserName(`Bienvenid@ ${nameParts[0]}\n${nameParts.slice(1).join(' ')}!`);
      } else {
        setUserName(`Bienvenid@ ${nameParts[0]}!`);
      }
    }

    // 2. Fetch Citas
    const fetchCitas = async () => {
      try {
        const response = await api.get('citas/');
        // Filtramos para quedarnos con las que no estén canceladas/completadas si hay lógica
        setCitas(response.data);
      } catch (error) {
        console.error("Error cargando citas", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const hoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });

  return (
    <div className="flex flex-col items-center pt-10">
      
      {/* Saludo */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-black text-center leading-tight mb-8 whitespace-pre-line">
        {userName}
      </h1>

      {/* Resumen */}
      <h2 className="text-2xl text-black mb-6">
        Tienes {citas.length} citas programadas
      </h2>

      {/* Fecha */}
      <div className="text-2xl font-bold text-black mb-12">
        {hoy}
      </div>

      {/* Caja de Próximas Citas */}
      <div className="bg-[#ecfdf4] w-full max-w-xl p-8 rounded-sm min-h-[150px] relative">
        <h3 className="text-center font-semibold text-lg text-black mb-6">
          Próximas {citas.length} citas:
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#0c3a6f]" />
          </div>
        ) : citas.length === 0 ? (
          <p className="text-center text-gray-500">No hay citas programadas para hoy.</p>
        ) : (
          <ul className="list-disc pl-10 space-y-2 text-lg text-[#0c3a6f] font-medium">
            {citas.map((cita) => {
              const dateObj = new Date(cita.fecha_hora_inicio);
              const time = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
              const mascotaNombre = cita.paciente_detalle?.nombre || 'Desconocido';
              const duenoNombre = cita.paciente_detalle?.dueno_detalle?.nombre || 'Desconocido';
              return (
                <li key={cita.id}>
                  <span className="text-black font-normal">
                    {time} - {mascotaNombre} (Dueño: {duenoNombre}).
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </div>
  );
};

export default DashboardAdmin;
