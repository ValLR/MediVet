import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, Search } from 'lucide-react';
import api from '../services/api';

const ScheduleAppointment = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Opciones de formulario
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);
  
  // Estado del Autocomplete de Dueños
  const [ownerSearchQuery, setOwnerSearchQuery] = useState('');
  const [ownerSearchResults, setOwnerSearchResults] = useState([]);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const searchRef = useRef(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    mascota_id: '',
    veterinario_id: '',
    fecha: '',
    horario: '',
    motivo: ''
  });

  const timeBlocks = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // 1. Obtener rol
    const userStr = localStorage.getItem('user');
    let currentRole = '';
    if (userStr) {
      const userObj = JSON.parse(userStr);
      currentRole = userObj.rol;
      setRole(currentRole);
    }

    // 2. Cargar veterinarios
    const fetchVets = async () => {
      try {
        const res = await api.get('usuarios/?rol=Veterinario');
        setVets(res.data.results || res.data);
      } catch (error) {
        console.error('Error cargando veterinarios', error);
      }
    };
    fetchVets();

    // 3. Si es dueño, cargar sus mascotas automáticamente
    if (currentRole === 'Dueno') {
      const fetchMyPets = async () => {
        try {
          const res = await api.get('pacientes/');
          setPets(res.data.results || res.data);
        } catch (error) {
          console.error('Error cargando mascotas', error);
        }
      };
      fetchMyPets();
    }

    // Clic fuera del autocompletado para cerrarlo
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowOwnerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efecto para buscar dueños (Debounce simple)
  useEffect(() => {
    if (role === 'Dueno') return;

    const delayDebounceFn = setTimeout(async () => {
      if (ownerSearchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const cleanQuery = ownerSearchQuery.replace(/\./g, '');
          const res = await api.get(`duenos/?search=${cleanQuery}`);
          setOwnerSearchResults(res.data.results || res.data);
          setShowOwnerDropdown(true);
        } catch (error) {
          console.error('Error buscando dueños', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setOwnerSearchResults([]);
        setShowOwnerDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [ownerSearchQuery, role]);

  const handleSelectOwner = async (owner) => {
    setSelectedOwner(owner);
    setOwnerSearchQuery(`${owner.nombre} (${owner.rut})`);
    setShowOwnerDropdown(false);
    
    // Al seleccionar dueño, buscar sus mascotas
    try {
      const res = await api.get(`pacientes/?dueno=${owner.id}`);
      setPets(res.data.results || res.data);
      // Resetear la mascota seleccionada
      setFormData(prev => ({ ...prev, mascota_id: '' }));
    } catch (error) {
      console.error('Error cargando mascotas del dueño', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkAvailability = async (vetId, dateTimeStr) => {
    try {
      const res = await api.get(`citas/?veterinario=${vetId}`);
      const citasDelVet = res.data.results || res.data;
      
      // Formatear el dateTimeStr que armamos a UTC string o compararlo directamente
      // La base de datos tiene ISO strings como "2026-05-10T09:00:00Z"
      const requestedDate = new Date(dateTimeStr);
      
      const isTaken = citasDelVet.some(cita => {
        // Ignorar citas canceladas
        if (cita.estado === 'Cancelada') return false;
        
        const citaDate = new Date(cita.fecha_hora_inicio);
        return citaDate.getTime() === requestedDate.getTime();
      });

      return !isTaken; // True si está disponible, False si está ocupado
    } catch (error) {
      console.error('Error verificando disponibilidad', error);
      return true; // Si falla la red, intentar guardar igual y que explote el backend
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Armar las fechas
      // formData.fecha es "YYYY-MM-DD", formData.horario es "HH:00"
      const dateTimeInicio = `${formData.fecha}T${formData.horario}:00`;
      
      // Calcular fin (+1 hora)
      const [hour, minute] = formData.horario.split(':');
      const finHour = (parseInt(hour) + 1).toString().padStart(2, '0');
      const dateTimeFin = `${formData.fecha}T${finHour}:${minute}:00`;

      // 2. Verificar disponibilidad
      const isAvailable = await checkAvailability(formData.veterinario_id, dateTimeInicio);
      
      if (!isAvailable) {
        toast.error('Esta hora ya está tomada por este doctor. Por favor elige otro horario u otro doctor.', {
          duration: 5000,
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            fontWeight: 'bold',
            border: '1px solid #f87171'
          }
        });
        setIsLoading(false);
        return;
      }

      // 3. Crear payload
      const payload = {
        paciente: formData.mascota_id,
        veterinario: formData.veterinario_id,
        fecha_hora_inicio: dateTimeInicio,
        fecha_hora_fin: dateTimeFin,
        motivo: formData.motivo,
        estado: 'Programada'
      };

      await api.post('citas/', payload);
      toast.success('Cita agendada exitosamente');
      
      // Redirigir al inicio correspondiente
      if (role === 'Dueno') {
        navigate('/dashboard-user');
      } else {
        navigate('/dashboard-admin');
      }

    } catch (error) {
      console.error('Error agendando cita', error);
      toast.error('Ocurrió un error al agendar la cita. Verifica los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-4xl font-extrabold text-black text-center mb-10 mt-4">
        Agendar Nueva Cita Médica
      </h1>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">

        {/* Buscador de dueños SOLO para Admin/Veterinario */}
        {role !== 'Dueno' && (
          <div className="flex justify-center mb-8" ref={searchRef}>
            <div className="w-full max-w-lg relative">
              <div className="relative">
                <input 
                  type="text"
                  value={ownerSearchQuery}
                  onChange={(e) => {
                    setOwnerSearchQuery(e.target.value);
                    if (!e.target.value) setSelectedOwner(null);
                  }}
                  onFocus={() => {
                    if (ownerSearchResults.length > 0) setShowOwnerDropdown(true);
                  }}
                  placeholder="Buscar nombre o RUT de dueño de mascota"
                  className="w-full bg-[#f3f0f5] text-gray-700 py-3 px-6 pr-12 rounded-full outline-none focus:ring-2 focus:ring-[#62c3a5] transition-all"
                />
                <div className="absolute right-4 top-3.5 text-gray-400">
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </div>
              </div>
              
              {/* Dropdown de Autocomplete */}
              {showOwnerDropdown && ownerSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                  {ownerSearchResults.map(owner => (
                    <div 
                      key={owner.id} 
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                      onClick={() => handleSelectOwner(owner)}
                    >
                      <p className="font-semibold text-[#0c3a6f]">{owner.nombre}</p>
                      <p className="text-xs text-gray-500">RUT: {owner.rut}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-black mb-1">Mascota</label>
            <select
              name="mascota_id"
              value={formData.mascota_id}
              onChange={handleChange}
              required
              disabled={role !== 'Dueno' && !selectedOwner} // Bloqueado hasta elegir dueño en modo admin
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="" disabled>Elija una mascota</option>
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>{pet.nombre} ({pet.especie})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-black mb-1">Veterinario</label>
            <select
              name="veterinario_id"
              value={formData.veterinario_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] bg-white"
            >
              <option value="" disabled>Elija un profesional</option>
              {vets.map(vet => (
                <option key={vet.id} value={vet.id}>Dr(a). {vet.first_name} {vet.last_name || vet.username}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-black mb-1">Fecha</label>
            <input 
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              min={hoy}
              required
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] bg-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-black mb-1">Horario</label>
            <select
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] bg-white"
            >
              <option value="" disabled>Elija un bloque horario</option>
              {timeBlocks.map(block => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex flex-col mt-6">
          <label className="text-sm font-semibold text-black mb-1">Motivo de consulta</label>
          <textarea 
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] resize-y"
            placeholder="Escriba su motivo de consulta"
          ></textarea>
        </div>

        {/* BOTÓN CONFIRMAR */}
        <div className="flex flex-row justify-center pt-8">
          <button 
            type="submit" 
            disabled={isLoading || (role !== 'Dueno' && !selectedOwner)}
            className="bg-[#0c3a6f] hover:bg-[#0a2f5a] disabled:bg-[#0c3a6f]/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-12 rounded-3xl transition-colors duration-200 flex items-center justify-center min-w-[200px] shadow-md"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Cita'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ScheduleAppointment;
