import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import PersonalInfo from './steps/PersonalInfo';
import FoodPreferences from './steps/FoodPreferences';
import GoalsObjectives from './steps/GoalsObjectives';
import FitnessLevel from './steps/FitnessLevel';
import MedicalHistory from './steps/MedicalHistory';
import DailyHabits from './steps/DailyHabits';
import Completion from './steps/Completion';
import SurveyProgress from './SurveyProgress';

const Survey: React.FC = () => {
  const { currentStep } = useSurvey();

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
        return null;
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
        return '¡Encuesta Completada!';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SurveyProgress className="mb-8" />
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{getStepTitle()}</h2>
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default Survey; 