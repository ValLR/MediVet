import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import medivetLogo from '../assets/medivetlogobig.png';

/**
 * Vista de Receta Médica (PrescriptionView).
 * Esta pantalla genera un documento imprimible con los datos de la atención médica.
 * Utiliza clases CSS especiales (print:hidden) para ocultar elementos durante la impresión.
 * Incluye una "firma virtual" generada automáticamente con las iniciales del veterinario.
 */
const PrescriptionView = () => {
  const { citaId } = useParams();
  const navigate = useNavigate();
  
  // Estados para manejar los datos que componen la receta
  const [isLoading, setIsLoading] = useState(true);
  const [cita, setCita] = useState(null);
  const [ficha, setFicha] = useState(null);
  const [receta, setReceta] = useState(null);
  const [medicamentosList, setMedicamentosList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch Cita
        const resCita = await api.get(`citas/${citaId}/`);
        setCita(resCita.data);

        // 2. Fetch Ficha
        const resFicha = await api.get(`fichas/?cita=${citaId}`);
        const fichas = resFicha.data.results || resFicha.data;
        
        if (fichas && fichas.length > 0) {
          const currentFicha = fichas[0];
          setFicha(currentFicha);

          // 3. Fetch Receta
          const resReceta = await api.get(`recetas/?ficha=${currentFicha.id}`);
          const recetas = resReceta.data.results || resReceta.data;

          if (recetas && recetas.length > 0) {
            const currentReceta = recetas[0];
            setReceta(currentReceta);
            try {
              const parsedMeds = JSON.parse(currentReceta.medicamentos);
              setMedicamentosList(parsedMeds);
            } catch (e) {
              console.warn("No se pudo parsear medicamentos JSON");
            }
          }
        } else {
          toast.error("Esta cita aún no tiene una ficha médica asociada.");
        }
      } catch (error) {
        console.error("Error fetching prescription:", error);
        toast.error("Error al cargar la receta.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [citaId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-[#0c3a6f]" />
      </div>
    );
  }

  if (!cita || !ficha) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-full space-y-6">
        <p className="text-red-500 font-bold text-xl">
          No se encontró la receta o aún no ha sido generada.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-[#0c3a6f] text-white px-6 py-2 rounded-full font-bold"
        >
          Volver
        </button>
      </div>
    );
  }

  const paciente = cita.paciente_detalle || {};
  const dueno = paciente.dueno_detalle || {};
  const vet = cita.veterinario_detalle || {};
  
  const vetNombreCompleto = `${vet.first_name || ''} ${vet.last_name || ''}`.trim() || vet.username;
  // Extraer iniciales para la "firma virtual"
  const vetIniciales = vetNombreCompleto
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const fechaFormat = new Date(ficha.fecha_atencion).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: '2-digit'
  });

  return (
    <div className="min-h-full bg-[#8ed2ba] flex flex-col items-center py-10 print:py-0 print:bg-white transition-colors duration-300">
      
      {/* Contenedor tipo Hoja Blanca */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-12 md:p-20 print:p-0 print:shadow-none print:rounded-none relative">
        
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-12">
          <img src={medivetLogo} alt="MediVet Logo" className="h-24 object-contain mb-6" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-2">
            Receta Médica Veterinaria
          </h1>
          <p className="text-xl font-bold text-black text-center">
            {fechaFormat}
          </p>
        </div>

        {/* Datos Identificatorios */}
        <div className="mb-10 text-lg text-black space-y-2">
          <p><span className="font-bold">Paciente:</span> {paciente.nombre}</p>
          <p><span className="font-bold">Propietario:</span> {dueno.nombre}</p>
          <p><span className="font-bold">RUT Dueño:</span> {dueno.rut}</p>
          <p><span className="font-bold">Médico Veterinario:</span> Dr(a). {vetNombreCompleto}</p>
        </div>

        {/* Diagnóstico */}
        <div className="mb-10 text-lg text-black">
          <p className="font-bold mb-2">Diagnóstico:</p>
          <p className="whitespace-pre-wrap">{ficha.diagnostico}</p>
        </div>

        {/* Prescripciones */}
        <div className="mb-20 text-lg text-black">
          <p className="font-bold mb-4">Prescripciones:</p>
          {medicamentosList.length > 0 ? (
            <ul className="list-none space-y-6">
              {medicamentosList.map((item, idx) => (
                <li key={idx} className="pl-4 border-l-4 border-[#0c3a6f]">
                  <p><span className="font-bold">Medicamento:</span> {item.medicamento}</p>
                  <p><span className="font-bold">Indicación:</span> {item.indicacion}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">No hay medicamentos recetados en esta consulta.</p>
          )}
        </div>

        {/* Firma Virtual */}
        <div className="mt-24 mb-10 flex flex-col items-center justify-center">
          {/* Sello de Firma (Círculo con iniciales) */}
          <div className="w-20 h-20 rounded-full border-4 border-[#0c3a6f] flex items-center justify-center mb-2 opacity-80 transform -rotate-12">
            <span className="text-3xl font-extrabold text-[#0c3a6f] font-serif">{vetIniciales}</span>
          </div>
          {/* Línea */}
          <div className="w-64 border-t-2 border-black mt-2 pt-2 text-center">
            <p className="font-bold text-black text-lg">Dr(a) {vetNombreCompleto}</p>
          </div>
        </div>

      </div>

      {/* Botones de Acción (Ocultos al imprimir) */}
      <div className="mt-8 flex space-x-6 print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="bg-[#0c3a6f] hover:bg-[#0a2f5a] text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <button 
          onClick={handlePrint}
          className="bg-[#0f8f2b] hover:bg-[#0c7022] text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center space-x-2 transition-colors"
        >
          <Printer className="w-5 h-5" />
          <span>Imprimir</span>
        </button>
      </div>

    </div>
  );
};

export default PrescriptionView;
