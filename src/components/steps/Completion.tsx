import { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Completion: React.FC = () => {
  const { finishSurvey, surveyData } = useSurvey();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlans = async () => {
    setLoading(true);
    setError(null);

    try {
      // Primero completar la encuesta y guardar las métricas
      await finishSurvey();

      // Llamar a ambas APIs en paralelo
      const [trainingResponse, mealResponse] = await Promise.all([
        axios.post('http://localhost:8000/api/generate-training-plan', {}, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.post('http://localhost:8000/api/generate-meal-plan', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Guardar los planes en localStorage
      localStorage.setItem('trainingPlan', JSON.stringify(trainingResponse.data));
      localStorage.setItem('mealPlan', JSON.stringify(mealResponse.data));

      // Redirigir a la página de recomendaciones
      navigate('/recommendations');
    } catch (err) {
      console.error('Error al generar planes:', err);
      setError('Hubo un error al generar tus planes personalizados. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    generatePlans();
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <CircularProgress />
        <p className="mt-4 text-gray-600">
          Generando tus planes personalizados...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert severity="error">{error}</Alert>
        <button
          onClick={handleContinue}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Felicidades!
        </h3>
        <p className="text-gray-600 mb-6">
          Has completado la encuesta de salud y bienestar. Con esta información,
          podremos crear un plan personalizado para ayudarte a alcanzar tus objetivos.
        </p>
      </div>

      <button
        onClick={handleContinue}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ir al siguiente paso
      </button>
    </div>
  );
};

export default Completion;
