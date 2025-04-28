import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import SurveyProgress from './SurveyProgress';
import SurveyNavigation from './SurveyNavigation';

interface SurveyStepProps {
  children: React.ReactNode;
  className?: string;
}

const SurveyStep: React.FC<SurveyStepProps> = ({ children, className = '' }) => {
  const { currentStep, totalSteps } = useSurvey();

  return (
    <div className={`space-y-6 ${className}`}>
      <SurveyProgress />
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Paso {currentStep} de {totalSteps}
          </h2>
        </div>
        {children}
      </div>
      <SurveyNavigation />
    </div>
  );
};

export default SurveyStep; 