import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../../context/SurveyContext';
import SurveyProgress from '../SurveyProgress';
import SurveyNavigation from '../SurveyNavigation';
import PersonalInfo from '../steps/PersonalInfo';
import FoodPreferences from '../steps/FoodPreferences';
import GoalsObjectives from '../steps/GoalsObjectives';
import FitnessLevel from '../steps/FitnessLevel';
import MedicalHistory from '../steps/MedicalHistory';
import DailyHabits from '../steps/DailyHabits';
import Completion from '../steps/Completion';

const Survey: React.FC = () => {
  const { currentStep, totalSteps, nextStep, prevStep, isLastStep, finishSurvey } = useSurvey();
  const navigate = useNavigate();

  const handleNext = () => {
    if (isLastStep) {
      finishSurvey();
      navigate('/dashboard');
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Encuesta de Salud</h1>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <SurveyProgress currentStep={currentStep} totalSteps={totalSteps} />
          {renderCurrentStep()}
          <SurveyNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
};

export default Survey; 