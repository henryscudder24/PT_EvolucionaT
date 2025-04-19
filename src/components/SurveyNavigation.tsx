import type React from 'react';
import { useSurvey } from '../context/SurveyContext';

// Mensajes motivacionales para mostrar al cambiar entre pasos
const motivationalMessages = [
  "¡Gran comienzo! Esta información nos ayudará a personalizar tu plan.",
  "¡Excelente! Conocer tus preferencias nos permitirá crear un plan que realmente disfrutes.",
  "¡Muy bien! Tus objetivos son la guía para crear un plan efectivo y personalizado.",
  "¡Último paso! Con esta información podremos adaptar perfectamente tu plan de entrenamiento."
];

const SurveyNavigation: React.FC = () => {
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    isStepComplete,
    isLastStep,
    totalSteps,
    finishSurvey
  } = useSurvey();

  // Determinar si el botón de siguiente debe estar habilitado
  const isNextEnabled = isStepComplete(currentStep);

  // Obtener el mensaje motivacional para el paso actual
  const currentMessage = motivationalMessages[currentStep - 1];

  // Función para manejar el botón de siguiente o finalizar
  const handleNextOrFinish = () => {
    if (isLastStep) {
      finishSurvey();
    } else {
      goToNextStep();
    }
  };

  return (
    <div className="mt-8">
      {/* Mensaje motivacional */}
      <div className="motivational-message mb-4">
        {currentMessage}
      </div>

      {/* Botones de navegación */}
      <div className="survey-nav">
        <button
          onClick={goToPreviousStep}
          className={`survey-button-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentStep === 1}
        >
          Anterior
        </button>

        <button
          onClick={handleNextOrFinish}
          disabled={!isNextEnabled}
          className={`${isLastStep ? 'bg-accent hover:bg-accent/90' : 'survey-button-primary'}
                      ${!isNextEnabled ? 'opacity-50 cursor-not-allowed' : ''}
                      py-2 px-6 rounded-lg text-white font-medium transition-colors`}
        >
          {isLastStep ? 'Finalizar Encuesta' : 'Siguiente'}
        </button>
      </div>

      {/* Indicador de paso */}
      <div className="text-center text-sm text-muted-foreground mt-4">
        Paso {currentStep} de {totalSteps}
      </div>
    </div>
  );
};

export default SurveyNavigation;
