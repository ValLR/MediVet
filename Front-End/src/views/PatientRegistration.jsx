import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import api from '../services/api';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingOwner, setIsSearchingOwner] = useState(false);
  
  // Estado para el dueño
  const [ownerData, setOwnerData] = useState({
    id: null,
    rut: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  // Estado para la mascota
  const [petData, setPetData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fecha_nacimiento: ''
  });

  // Especies permitidas según lo conversado
  const speciesOptions = [
    'Perro',
    'Gato',
    'Ave',
    'Roedor',
    'Exótico',
    'Otro'
  ];

  // Utilidad para formatear RUT con puntos y guión
  const formatRut = (value) => {
    let cleanRut = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (cleanRut.length === 0) return '';
    const dv = cleanRut.slice(-1);
    const body = cleanRut.slice(0, -1);
    if (body.length === 0) return dv;
    const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${bodyWithDots}-${dv}`;
  };

  // Buscar dueño por RUT
  const handleRutBlur = async () => {
    if (!ownerData.rut) return;
    
    const rutParaBusqueda = ownerData.rut.replace(/\./g, '');
    setIsSearchingOwner(true);
    
    try {
      const response = await api.get(`duenos/?search=${rutParaBusqueda}`);
      const results = response.data.results || response.data;
      
      if (results && results.length > 0) {
        // Encontramos una coincidencia
        const found = results.find(d => d.rut.toLowerCase() === rutParaBusqueda.toLowerCase()) || results[0];
        setOwnerData({
          id: found.id,
          rut: formatRut(found.rut), // Formateamos el que viene de la BD (sin puntos)
          nombre: found.nombre,
          telefono: found.telefono,
          email: found.email || '',
          direccion: found.direccion || ''
        });
        toast.success('Dueño encontrado, datos autocompletados.');
      } else {
        setOwnerData(prev => ({
          ...prev,
          id: null,
          nombre: '',
          telefono: '',
          email: '',
          direccion: ''
        }));
      }
    } catch (error) {
      console.error('Error buscando dueño:', error);
    } finally {
      setIsSearchingOwner(false);
    }
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rut') {
      setOwnerData({ ...ownerData, rut: formatRut(value) });
    } else {
      setOwnerData({ ...ownerData, [name]: value });
    }
  };

  const handlePetChange = (e) => {
    setPetData({ ...petData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let currentOwnerId = ownerData.id;

      // 1. Si no hay ID de dueño, lo creamos primero
      if (!currentOwnerId) {
        const duenoPayload = {
          rut: ownerData.rut.replace(/\./g, ''), // Mandar sin puntos
          nombre: ownerData.nombre,
          telefono: ownerData.telefono,
          email: ownerData.email,
          direccion: ownerData.direccion
        };
        const duenoResponse = await api.post('duenos/', duenoPayload);
        currentOwnerId = duenoResponse.data.id;
      }

      // 2. Crear el paciente enlazado al dueño
      const pacientePayload = {
        dueno: currentOwnerId,
        nombre: petData.nombre,
        especie: petData.especie,
        raza: petData.raza,
        fecha_nacimiento: petData.fecha_nacimiento || null
      };

      await api.post('pacientes/', pacientePayload);
      
      toast.success('Paciente registrado con éxito');
      navigate('/dashboard-admin');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Ocurrió un error al guardar los datos. Revisa los campos.');
    } finally {
      setIsLoading(false);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-4xl font-extrabold text-black text-center mb-10 mt-4">
        Registro de Nuevo Paciente
      </h1>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10">
        
        {/* SECCIÓN DUEÑO */}
        <section>
          <h2 className="text-xl font-bold text-black mb-6">Datos dueño</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">RUT</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="rut"
                  value={ownerData.rut}
                  onChange={handleOwnerChange}
                  onBlur={handleRutBlur}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5]"
                  placeholder="Ej: 11.111.111-1"
                />
                {isSearchingOwner && (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0c3a6f] absolute right-3 top-3" />
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">Nombre completo</label>
              <input 
                type="text" 
                name="nombre"
                value={ownerData.nombre}
                onChange={handleOwnerChange}
                required
                disabled={!!ownerData.id} // Bloqueado si ya existe
                className={`w-full border rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] ${ownerData.id ? 'bg-gray-100 border-gray-200' : 'border-gray-300'}`}
                placeholder="Juan Perez"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">Teléfono de contacto</label>
              <input 
                type="text" 
                name="telefono"
                value={ownerData.telefono}
                onChange={handleOwnerChange}
                required
                disabled={!!ownerData.id}
                className={`w-full border rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] ${ownerData.id ? 'bg-gray-100 border-gray-200' : 'border-gray-300'}`}
                placeholder="+56912345678"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">Correo electrónico</label>
              <input 
                type="email" 
                name="email"
                value={ownerData.email}
                onChange={handleOwnerChange}
                disabled={!!ownerData.id}
                className={`w-full border rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] ${ownerData.id ? 'bg-gray-100 border-gray-200' : 'border-gray-300'}`}
                placeholder="nombre@mail.com"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-black mb-1">Dirección</label>
              <input 
                type="text" 
                name="direccion"
                value={ownerData.direccion}
                onChange={handleOwnerChange}
                disabled={!!ownerData.id}
                className={`w-full border rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] ${ownerData.id ? 'bg-gray-100 border-gray-200' : 'border-gray-300'}`}
                placeholder="Avenida principal 1122"
              />
            </div>

          </div>
        </section>

        {/* SECCIÓN MASCOTA */}
        <section>
          <h2 className="text-xl font-bold text-black mb-6">Datos de la mascota</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">Nombre</label>
              <input 
                type="text" 
                name="nombre"
                value={petData.nombre}
                onChange={handlePetChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5]"
                placeholder="Ej: Moria"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">Especie</label>
              <select 
                name="especie"
                value={petData.especie}
                onChange={handlePetChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] bg-white"
              >
                <option value="" disabled>Elija una especie</option>
                {speciesOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">Raza</label>
              <input 
                type="text" 
                name="raza"
                value={petData.raza}
                onChange={handlePetChange}
                className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5]"
                placeholder="Ej: Labrador"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">Fecha de nacimiento</label>
              <input 
                type="date" 
                name="fecha_nacimiento"
                value={petData.fecha_nacimiento}
                onChange={handlePetChange}
                max={hoy}
                className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#62c3a5] bg-white"
              />
            </div>

          </div>
        </section>

        {/* BOTONES */}
        <div className="flex flex-row justify-center space-x-4 pt-10">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#0c3a6f] hover:bg-[#0a2f5a] text-white font-semibold py-3 px-10 rounded-3xl transition-colors duration-200 flex items-center justify-center min-w-[150px]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar'}
          </button>

          <button 
            type="button" 
            onClick={() => navigate('/dashboard-admin')}
            className="bg-[#adb5bd] hover:bg-[#9ca3af] text-[#0c3a6f] font-semibold py-3 px-10 rounded-3xl transition-colors duration-200 min-w-[150px]"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
};

export default PatientRegistration;
