import React, { useState, useEffect } from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import api from '../services/api';

/**
 * Componente DashboardAdmin: Vista principal para Veterinarios y Administrativos.
 * Muestra el saludo al usuario, las próximas citas del día y un widget
 * con indicadores económicos consumidos de una API externa (Mindicador.cl).
 */
const DashboardAdmin = () => {
  // Estado para almacenar la lista de citas obtenidas del backend
  const [citas, setCitas] = useState([]);
  
  // Estado para el nombre formateado del usuario activo
  const [userName, setUserName] = useState('');
  
  // Estado para manejar el indicador de carga principal
  const [isLoading, setIsLoading] = useState(true);

  // Estados para la API externa de indicadores económicos
  const [indicadores, setIndicadores] = useState({ uf: null, dolar: null });
  const [loadingIndicadores, setLoadingIndicadores] = useState(true);

  useEffect(() => {
    // 1. Obtener y formatear el nombre del usuario desde localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      const nameParts = userObj.nombre_completo ? userObj.nombre_completo.split(' ') : ['Administrador'];
      
      // Formatear el saludo dividiendo el primer nombre y los apellidos
      if (nameParts.length > 1) {
        setUserName(`Bienvenid@ ${nameParts[0]}\n${nameParts.slice(1).join(' ')}!`);
      } else {
        setUserName(`Bienvenid@ ${nameParts[0]}!`);
      }
    }

    // 2. Función asíncrona para obtener las citas del backend
    const fetchCitas = async () => {
      try {
        const response = await api.get('citas/');
        // Aquí podríamos filtrar solo las citas de hoy si fuera necesario
        setCitas(response.data);
      } catch (error) {
        console.error("Error cargando citas", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 3. Función asíncrona para consumir la API externa (Mindicador)
    const fetchIndicadores = async () => {
      try {
        // Consumimos la API pública chilena para indicadores económicos
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();
        
        // Guardamos los valores de UF y Dólar observados hoy
        setIndicadores({
          uf: data.uf.valor,
          dolar: data.dolar.valor
        });
      } catch (error) {
        console.error("Error cargando indicadores externos", error);
      } finally {
        setLoadingIndicadores(false);
      }
    };

    // Ejecutar ambas peticiones al montar el componente
    fetchCitas();
    fetchIndicadores();
  }, []);

  // Formato de la fecha actual para mostrar en pantalla
  const hoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });

  return (
    <div className="flex flex-col items-center pt-10">
      
      {/* Sección de Saludo Personalizado */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-black text-center leading-tight mb-8 whitespace-pre-line">
        {userName}
      </h1>

      {/* Resumen de Citas Activas */}
      <h2 className="text-2xl text-black mb-6">
        Tienes {citas.length} citas programadas
      </h2>

      {/* Indicador de Fecha Actual */}
      <div className="text-2xl font-bold text-black mb-12">
        {hoy}
      </div>

      {/* Contenedor Principal: Citas e Indicadores */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 items-start">
        
        {/* Caja de Próximas Citas (Lógica de Negocio) */}
        <div className="bg-[#ecfdf4] w-full md:w-2/3 p-8 rounded-sm min-h-[150px] shadow-sm">
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

        {/* Widget de API Externa: Indicadores Económicos */}
        <div className="bg-white border border-gray-200 w-full md:w-1/3 p-6 rounded-lg shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-[#0c3a6f]">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-bold text-lg">Indicadores Hoy</h3>
          </div>
          
          {loadingIndicadores ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="font-semibold text-gray-600">UF</span>
                <span className="font-bold text-black">
                  ${indicadores.uf ? indicadores.uf.toLocaleString('es-CL') : '---'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="font-semibold text-gray-600">Dólar Observado</span>
                <span className="font-bold text-black">
                  ${indicadores.dolar ? indicadores.dolar.toLocaleString('es-CL') : '---'}
                </span>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Fuente: mindicador.cl</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DashboardAdmin;
