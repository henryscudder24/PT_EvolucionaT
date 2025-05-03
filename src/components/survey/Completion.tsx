import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../../context/SurveyContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Completion: React.FC = () => {
  const navigate = useNavigate();
  const { finishSurvey } = useSurvey();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // Primero completamos la encuesta
      const surveyCompleted = await finishSurvey();
      if (!surveyCompleted) {
        throw new Error('Error al completar la encuesta');
      }

      // Obtenemos el token para las siguientes peticiones
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Generamos los planes en paralelo
      const [trainingResponse, mealResponse] = await Promise.all([
        axios.post('http://localhost:8000/api/generate-training-plan', {}, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.post('http://localhost:8000/api/generate-meal-plan', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (trainingResponse.status === 200 && mealResponse.status === 200) {
        toast.success('¡Planes generados con éxito!');
        // Redirigimos a la página de recomendaciones
        navigate('/recomendaciones');
      } else {
        throw new Error('Error al generar los planes');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error al generar tus planes. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="text-center space-y-6 max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900">
          ¡Felicidades! Has completado la encuesta
        </h2>
        
        <p className="text-lg text-gray-600">
          Ahora vamos a generar tu plan personalizado basado en tus respuestas.
          Esto puede tomar unos momentos, por favor sé paciente.
        </p>

        <div className="mt-8">
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg text-white font-medium text-lg
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Generando planes...</span>
              </div>
            ) : (
              'Generar mi plan personalizado'
            )}
          </button>
        </div>

        {isLoading && (
          <div className="mt-6 text-sm text-gray-500">
            <p>Estamos procesando tu información...</p>
            <p className="mt-2">Esto puede tomar unos minutos. Por favor, no cierres esta ventana.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Completion; 