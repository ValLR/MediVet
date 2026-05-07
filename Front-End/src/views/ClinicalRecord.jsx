import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ClinicalRecord = () => {
  const { citaId } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cita, setCita] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [recetaId, setRecetaId] = useState(null);

  // Form states
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  
  // Prescriptions
  const [medicamentosList, setMedicamentosList] = useState([]);
  const [medInput, setMedInput] = useState('');
  const [indInput, setIndInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch Cita details
        const resCita = await api.get(`citas/${citaId}/`);
        setCita(resCita.data);

        // 2. Fetch existing Ficha for this Cita (if any)
        const resFicha = await api.get(`fichas/?cita=${citaId}`);
        const fichas = resFicha.data.results || resFicha.data;

        if (fichas && fichas.length > 0) {
          const ficha = fichas[0];
          setFichaId(ficha.id);
          setDiagnostico(ficha.diagnostico);
          setTratamiento(ficha.tratamiento);

          // 3. Fetch Receta for this Ficha
          const resReceta = await api.get(`recetas/?ficha=${ficha.id}`);
          const recetas = resReceta.data.results || resReceta.data;

          if (recetas && recetas.length > 0) {
            const receta = recetas[0];
            setRecetaId(receta.id);
            try {
              // Intentar parsear el JSON de medicamentos
              const parsedMeds = JSON.parse(receta.medicamentos);
              setMedicamentosList(parsedMeds);
            } catch (e) {
              // Si no es JSON (recetas antiguas), no mostrar pastillas o intentar parsear
              console.warn("Receta antigua, no se puede parsear como JSON");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching clinical record data:", error);
        toast.error("Error al cargar la cita");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [citaId]);

  const calculateAge = (dobString) => {
    if (!dobString) return 'Desconocida';
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age === 0 ? 'Menos de 1 año' : `${age} años`;
  };

  const handleAddMedicamento = () => {
    if (!medInput.trim() || !indInput.trim()) {
      toast.error("Debe ingresar tanto el medicamento como la indicación");
      return;
    }
    setMedicamentosList([...medicamentosList, { medicamento: medInput.trim(), indicacion: indInput.trim() }]);
    setMedInput('');
    setIndInput('');
  };

  const handleRemoveMedicamento = (index) => {
    setMedicamentosList(medicamentosList.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!diagnostico.trim() || !tratamiento.trim()) {
      toast.error("El diagnóstico y tratamiento son obligatorios");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Guardar o Actualizar Ficha
      const fichaPayload = {
        cita: citaId,
        paciente: cita.paciente,
        veterinario: cita.veterinario,
        diagnostico,
        tratamiento
      };

      let currentFichaId = fichaId;

      if (fichaId) {
        // Actualizar
        await api.patch(`fichas/${fichaId}/`, fichaPayload);
      } else {
        // Crear
        const resFicha = await api.post(`fichas/`, fichaPayload);
        currentFichaId = resFicha.data.id;
        setFichaId(currentFichaId);
      }

      // 2. Guardar o Actualizar Receta (Solo si hay medicamentos)
      if (medicamentosList.length > 0) {
        // Guardamos la lista en JSON para poder re-editar fácilmente
        // Y guardamos un texto legible en indicaciones por seguridad
        const indicacionesLegibles = medicamentosList
          .map((m, i) => `${i + 1}. ${m.medicamento}: ${m.indicacion}`)
          .join('\n');

        const recetaPayload = {
          ficha: currentFichaId,
          medicamentos: JSON.stringify(medicamentosList),
          indicaciones: indicacionesLegibles
        };

        if (recetaId) {
          await api.patch(`recetas/${recetaId}/`, recetaPayload);
        } else {
          await api.post(`recetas/`, recetaPayload);
        }
      }

      // 3. Marcar cita como Completada
      if (cita.estado !== 'Completada') {
        await api.patch(`citas/${citaId}/`, { estado: 'Completada' });
      }

      toast.success("Ficha guardada exitosamente");
      // Dirigir a la vista de impresión
      navigate(`/dashboard-admin/receta/${citaId}`);

    } catch (error) {
      console.error("Error saving clinical record:", error);
      toast.error("Ocurrió un error al guardar la ficha");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-[#0c3a6f]" />
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="flex-1 p-8 text-center text-red-500 font-bold text-xl">
        No se encontró la cita solicitada.
      </div>
    );
  }

  const paciente = cita.paciente_detalle || {};
  const dueno = paciente.dueno_detalle || {};

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col items-center pb-20">
      
      {/* Título de la página */}
      <h1 className="text-4xl font-extrabold text-black mt-8 mb-6 text-center">
        Paciente Actual
      </h1>

      {/* Encabezado de Información del Paciente */}
      <div className="w-full bg-[#f8f9fa] py-8 px-12 border-b border-t border-gray-200 mb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-6 text-[#0c3a6f] text-lg">
          <div className="col-span-1"><span className="font-bold">Nombre:</span> <span className="text-black">{paciente.nombre}</span></div>
          <div className="col-span-1"><span className="font-bold">Raza:</span> <span className="text-black">{paciente.raza || 'N/A'}</span></div>
          <div className="col-span-1"><span className="font-bold">Especie:</span> <span className="text-black">{paciente.especie}</span></div>
          <div className="col-span-1"><span className="font-bold">Edad:</span> <span className="text-black">{calculateAge(paciente.fecha_nacimiento)}</span></div>
          
          <div className="col-span-1 md:col-span-2 mt-4"><span className="font-bold">Dueño (a):</span> <span className="text-black">{dueno.nombre}</span></div>
          <div className="col-span-1 md:col-span-2 mt-4"><span className="font-bold">Motivo de consulta:</span> <span className="text-black">{cita.motivo}</span></div>
        </div>
      </div>

      {/* Formulario Principal */}
      <div className="w-full max-w-4xl px-8 space-y-10">
        
        <div className="flex flex-col">
          <label className="text-[#0c3a6f] font-bold text-xl mb-3">Diagnóstico</label>
          <textarea 
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#0c3a6f] resize-y"
            placeholder="Escribir diagnóstico..."
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[#0c3a6f] font-bold text-xl mb-3">Tratamiento</label>
          <textarea 
            value={tratamiento}
            onChange={(e) => setTratamiento(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#0c3a6f] resize-y"
            placeholder="Escribir tratamiento..."
          />
        </div>

        {/* Sección de Prescripción de Medicamentos */}
        <div className="bg-[#f3f0f5] rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold text-black text-center mb-8">
            Prescripción de Medicamentos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-8">
            <div className="col-span-1 md:col-span-4 flex flex-col">
              <label className="text-[#0c3a6f] font-bold mb-2">Medicamento</label>
              <input 
                type="text" 
                value={medInput}
                onChange={(e) => setMedInput(e.target.value)}
                placeholder="Ej: Meloxicam 0.5mg"
                className="w-full border-none rounded-md p-3 text-black focus:ring-2 focus:ring-[#0c3a6f]"
              />
            </div>
            <div className="col-span-1 md:col-span-7 flex flex-col">
              <label className="text-[#0c3a6f] font-bold mb-2">Indicación</label>
              <input 
                type="text" 
                value={indInput}
                onChange={(e) => setIndInput(e.target.value)}
                placeholder="Ej: Dar 3 gotas cada 24 horas por 5 días"
                className="w-full border-none rounded-md p-3 text-black focus:ring-2 focus:ring-[#0c3a6f]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMedicamento();
                  }
                }}
              />
            </div>
            <div className="col-span-1 md:col-span-1 flex justify-end">
              <button 
                type="button"
                onClick={handleAddMedicamento}
                className="bg-[#0c3a6f] hover:bg-[#0a2f5a] text-white p-3 rounded-md transition-colors"
                title="Añadir a receta"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Píldoras de Medicamentos */}
          <div className="space-y-3">
            {medicamentosList.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-[#e5e7eb] rounded-lg p-4 pr-12 relative group">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-black">{item.medicamento}</span>
                  <span className="text-sm text-gray-700">{item.indicacion}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => handleRemoveMedicamento(index)}
                  className="absolute right-4 text-gray-500 hover:text-red-500 transition-colors"
                  title="Eliminar medicamento"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {medicamentosList.length === 0 && (
              <div className="text-center text-gray-400 italic py-4">
                No hay medicamentos prescritos aún.
              </div>
            )}
          </div>

        </div>

        {/* Botón Finalizar */}
        <div className="flex justify-center pt-6">
          <button 
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="bg-[#0c3a6f] hover:bg-[#0a2f5a] text-white font-bold py-4 px-12 rounded-full transition-colors duration-200 shadow-md text-lg disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Guardando...</span>
              </div>
            ) : 'Finalizar y Generar Receta'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClinicalRecord;
