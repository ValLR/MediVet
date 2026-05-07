import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

/**
 * Vista de Historial de Citas.
 * Muestra una tabla con todas las citas registradas en el sistema.
 * Es una vista compartida: 
 * - Los Veterinarios ven quién es el dueño de la mascota.
 * - Los Dueños ven qué veterinario atenderá a su mascota.
 * Incluye paginación para manejar grandes volúmenes de datos.
 */
const AppointmentsHistory = () => {
  const navigate = useNavigate();
  // Estados para identificar al usuario y sus citas
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para controlar la paginación de la tabla
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Hook inicial para cargar los datos del usuario desde el almacenamiento local
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setRole(userObj.rol);
      setUserName(userObj.nombre_completo);
    }
  }, []);

  const fetchAppointments = async (pageNumber) => {
    setIsLoading(true);
    try {
      // Ajustamos límite y offset según la página
      // Suponiendo que el backend DRF soporta limit y offset, o ?page= si es PageNumberPagination
      // Vamos a intentar ?page= (por defecto en DRF)
      const response = await api.get(`citas/?page=${pageNumber}`);
      
      // Si el backend devuelve formato paginado (con count, next, previous, results)
      if (response.data.results) {
        setAppointments(response.data.results);
        setHasNext(!!response.data.next);
        setHasPrev(!!response.data.previous);
      } else {
        // Si no está paginado, seteamos todo y desactivamos botones
        setAppointments(response.data);
        setHasNext(false);
        setHasPrev(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(page);
  }, [page]);

  const handleNextPage = () => {
    if (hasNext) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (hasPrev) setPage(prev => prev - 1);
  };

  // Función para obtener el color del estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Programada': return 'bg-[#10b981]'; // Verde
      case 'Completada': return 'bg-[#3b82f6]'; // Azul
      case 'Cancelada': return 'bg-[#ef4444]'; // Rojo
      default: return 'bg-gray-400';
    }
  };

  const isVet = role === 'Veterinario' || role === 'Administrativo';

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="text-center mb-10 mt-4">
        <h1 className="text-4xl font-extrabold text-black">
          {isVet ? `Consultas - ${userName}` : 'Historial de Citas'}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#0c3a6f]" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-[#d9d9d9] rounded-xl overflow-hidden p-6 shadow-sm">
          
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="text-[#0c3a6f] font-bold border-b border-gray-300">
                  <th className="py-4 px-2"></th> {/* Status dot */}
                  <th className="py-4 px-4">Fecha</th>
                  <th className="py-4 px-4">Hora</th>
                  <th className="py-4 px-4">Mascota</th>
                  {/* Columna dinámica */}
                  {isVet ? (
                    <th className="py-4 px-4">Dueño</th>
                  ) : (
                    <th className="py-4 px-4">Veterinario</th>
                  )}
                  <th className="py-4 px-4 text-left">Motivo</th>
                  <th className="py-4 px-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-gray-500 font-medium">
                      No hay citas para mostrar.
                    </td>
                  </tr>
                ) : (
                  appointments.map((cita) => {
                    const dateObj = new Date(cita.fecha_hora_inicio);
                    // Formato DD/MM/YY
                    const dateStr = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    // Formato HH:MM
                    const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    
                    const mascotaNombre = cita.paciente_detalle?.nombre || 'Desconocido';
                    const duenoNombre = cita.paciente_detalle?.dueno_detalle?.nombre || 'Desconocido';
                    const vetDetalle = cita.veterinario_detalle;
                    const vetNombre = vetDetalle 
                      ? `${vetDetalle.first_name || ''} ${vetDetalle.last_name || ''}`.trim() || vetDetalle.username 
                      : 'Desconocido';
                    
                    const isCompletada = cita.estado === 'Completada';

                    return (
                      <tr key={cita.id} className="border-b border-gray-300/50 hover:bg-black/5 transition-colors">
                        {/* Indicador de Estado */}
                        <td className="py-4 px-2">
                          <div className={`w-4 h-4 rounded-full mx-auto ${getStatusColor(cita.estado)}`} title={cita.estado}></div>
                        </td>
                        
                        <td className="py-4 px-4 text-black font-medium">{dateStr}</td>
                        <td className="py-4 px-4 text-black font-medium">{timeStr}</td>
                        <td className="py-4 px-4 text-black">{mascotaNombre}</td>
                        
                        {/* Celda dinámica */}
                        {isVet ? (
                          <td className="py-4 px-4 text-black">{duenoNombre}</td>
                        ) : (
                          <td className="py-4 px-4 text-black">{vetNombre}</td>
                        )}
                        
                        <td className="py-4 px-4 text-left text-black truncate max-w-[200px]" title={cita.motivo}>
                          {cita.motivo}
                        </td>
                        
                        <td className="py-4 px-4">
                          {isVet ? (
                            <button 
                              onClick={() => navigate(`/dashboard-admin/atencion/${cita.id}`)}
                              className={`text-white font-semibold py-2 px-6 rounded-3xl transition-colors text-sm w-[160px]
                                ${cita.estado === 'Programada' ? 'bg-[#0f8f2b] hover:bg-[#0c7022]' : ''}
                                ${isCompletada ? 'bg-[#3b82f6] hover:bg-[#2563eb]' : ''}
                                ${cita.estado === 'Cancelada' ? 'bg-gray-400 cursor-not-allowed opacity-50' : ''}
                              `}
                              disabled={cita.estado === 'Cancelada'}
                            >
                              {isCompletada ? 'Ver Atención' : 'Iniciar Atención'}
                            </button>
                          ) : (
                            <button 
                              onClick={() => navigate(`/dashboard-user/receta/${cita.id}`)}
                              className={`text-white font-semibold py-2 px-6 rounded-3xl transition-colors text-sm w-[160px]
                                ${isCompletada ? 'bg-[#0f8f2b] hover:bg-[#0c7022]' : 'bg-gray-400 cursor-not-allowed opacity-50'}
                              `}
                              disabled={!isCompletada}
                              title={!isCompletada ? "La receta aún no está lista" : ""}
                            >
                              Ver Receta
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de Paginación */}
          {(hasPrev || hasNext) && (
            <div className="flex justify-between items-center mt-6 px-4">
              <button 
                onClick={handlePrevPage}
                disabled={!hasPrev}
                className="flex items-center space-x-2 text-[#0c3a6f] disabled:text-gray-400 font-semibold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Anterior</span>
              </button>
              
              <span className="text-gray-600 font-medium">Página {page}</span>
              
              <button 
                onClick={handleNextPage}
                disabled={!hasNext}
                className="flex items-center space-x-2 text-[#0c3a6f] disabled:text-gray-400 font-semibold transition-colors"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Leyenda de Estados */}
      <div className="flex justify-center items-center space-x-12 mt-12 mb-8">
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${getStatusColor('Programada')}`}></div>
          <span className="font-bold text-black text-lg">Programada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${getStatusColor('Completada')}`}></div>
          <span className="font-bold text-black text-lg">Completada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${getStatusColor('Cancelada')}`}></div>
          <span className="font-bold text-black text-lg">Cancelada</span>
        </div>
      </div>

    </div>
  );
};

export default AppointmentsHistory;
