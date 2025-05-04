import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../../context/SurveyContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Completion: React.FC = () => {
  const { surveyData, finishSurvey } = useSurvey();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ID del video de YouTube que se mostrará durante la carga
  const loadingVideoId = "bfXyJw9eCAQ"; // Video de motivación fitness

  useEffect(() => {
    const generatePlans = async () => {
      try {
        // Iniciar la generación de planes
        setProgress(10);
        
        // Enviar datos de la encuesta
        await finishSurvey();
        setProgress(30);
        
        // Generar plan de entrenamiento
        await axios.post('http://localhost:8000/api/generate-training-plan', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(60);
        
        // Generar plan de alimentación
        await axios.post('http://localhost:8000/api/generate-meal-plan', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(90);
        
        // Completar la generación
        setProgress(100);
        
        // Redirigir a la página de recomendaciones
        setTimeout(() => {
          navigate('/recommendations');
        }, 1000);
        
      } catch (error: any) {
        console.error('Error al generar planes:', error);
        setError(error.response?.data?.detail || 'Error al generar los planes. Por favor, intenta de nuevo.');
      }
    };

    generatePlans();
  }, [finishSurvey, navigate, token]);

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/survey')}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
        >
          Volver a intentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Generando tu plan personalizado...
      </h2>
      
      <div className="w-full max-w-2xl mx-auto my-4">
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src={`https://www.youtube.com/embed/${loadingVideoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0`}
            title="Loading Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      
      <div className="w-full max-w-md mt-8">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center mt-2 text-gray-600">
          {progress}% completado
        </p>
      </div>
      
      <p className="mt-6 text-gray-600 text-center max-w-md">
        Estamos creando un plan único adaptado a tus necesidades y objetivos.
        Esto puede tomar unos minutos...
      </p>
    </div>
  );
};

export default Completion;
