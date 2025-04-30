import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface SurveyNavigationProps {
  className?: string;
}

// Mensajes motivacionales para mostrar al cambiar entre pasos
const motivationalMessages = [
  "¡Gran comienzo! Esta información nos ayudará a personalizar tu plan.",
  "¡Excelente! Conocer tus preferencias nos permitirá crear un plan que realmente disfrutes.",
  "¡Muy bien! Tus objetivos son la guía para crear un plan efectivo y personalizado.",
  "¡Último paso! Con esta información podremos adaptar perfectamente tu plan de entrenamiento."
];

const SurveyNavigation: React.FC<SurveyNavigationProps> = ({ className = '' }) => {
  const {
    currentStep,
    totalSteps,
    prevStep,
    nextStep,
    isLastStep,
    isStepComplete,
    surveyData
  } = useSurvey();
  const navigate = useNavigate();

  // Mensaje motivacional para el paso actual
  const currentMessage = motivationalMessages[currentStep - 1] || '';

  // Funciones para navegar entre pasos
  const handleNext = () => {
    if (currentStep < totalSteps) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      prevStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función para enviar los datos al backend
  const submitSurvey = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Debes iniciar sesión para completar la encuesta');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/survey/complete',
        surveyData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        toast.success('¡Encuesta completada con éxito!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error al enviar la encuesta:', error);
      toast.error('Error al guardar la encuesta. Por favor, intenta nuevamente.');
    }
  };

  // Función para manejar el botón de siguiente o finalizar
  const handleNextOrFinish = () => {
    if (isLastStep) {
      submitSurvey();
    } else {
      handleNext();
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {currentMessage}
        </div>
        <div className="flex space-x-4">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Anterior
            </button>
          )}
          <button
            onClick={handleNextOrFinish}
            disabled={!isStepComplete(currentStep)}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isStepComplete(currentStep)
                ? 'bg-primary hover:bg-primary-dark'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isLastStep ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyNavigation;
