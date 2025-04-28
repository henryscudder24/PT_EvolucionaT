import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    finishSurvey
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

  // Función para manejar el botón de siguiente o finalizar
  const handleNextOrFinish = () => {
    if (isLastStep) {
      // Finaliza la encuesta
      finishSurvey();
      // Muestra mensaje de éxito
      toast.success('¡Encuesta completada con éxito! Gracias por participar.');
      // Redirige a perfil de usuario
      navigate('/profile');
    } else {
      handleNext();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Mensaje motivacional */}
      <p className="text-center text-gray-600 italic">
        {currentMessage}
      </p>

      {/* Botones de navegación */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-md ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Anterior
        </button>
        <button
          onClick={handleNextOrFinish}
          disabled={!isStepComplete(currentStep)}
          className={`px-4 py-2 rounded-md ${
            !isStepComplete(currentStep)
              ? 'bg-blue-200 text-blue-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLastStep ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default SurveyNavigation;
