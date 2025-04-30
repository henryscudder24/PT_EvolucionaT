import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import SurveyProgress from './SurveyProgress';
import SurveyNavigation from './SurveyNavigation';
import PersonalInfo from './steps/PersonalInfo';
import FoodPreferences from './steps/FoodPreferences';
import GoalsObjectives from './steps/GoalsObjectives';
import FitnessLevel from './steps/FitnessLevel';
import MedicalHistory from './steps/MedicalHistory';
import DailyHabits from './steps/DailyHabits';
import Completion from './steps/Completion';
import { toast } from 'react-hot-toast';

const Survey: React.FC = () => {
  const { currentStep, totalSteps, nextStep, prevStep, isLastStep, finishSurvey, isStepComplete } = useSurvey();
  const navigate = useNavigate();

  const handleNext = () => {
    if (isStepComplete(currentStep)) {
      if (isLastStep) {
        try {
          finishSurvey();
          toast.success('¡Encuesta completada con éxito! Gracias por tu participación.');
          setTimeout(() => {
            navigate('/profile');
          }, 1000);
        } catch (error) {
          console.error('Error al finalizar la encuesta:', error);
          toast.error('Hubo un error al completar la encuesta. Por favor, intenta nuevamente.');
        }
      } else {
        nextStep();
      }
    } else {
      toast.error('Por favor, completa todos los campos requeridos antes de continuar.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo />;
      case 2:
        return <FoodPreferences />;
      case 3:
        return <GoalsObjectives />;
      case 4:
        return <FitnessLevel />;
      case 5:
        return <MedicalHistory />;
      case 6:
        return <DailyHabits />;
      case 7:
        return <Completion />;
      default:
        return <PersonalInfo />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Información Personal';
      case 2:
        return 'Preferencias Alimentarias';
      case 3:
        return 'Metas y Objetivos';
      case 4:
        return 'Nivel de Condición Física';
      case 5:
        return 'Historial Médico';
      case 6:
        return 'Hábitos Diarios';
      case 7:
        return '¡Completado!';
      default:
        return 'Encuesta de Salud';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">{getStepTitle()}</h1>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <SurveyProgress />
          {renderCurrentStep()}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !isStepComplete(currentStep)
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLastStep ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey; 