import React from 'react';
import { useSurvey } from '../context/SurveyContext';

interface SurveyProgressProps {
  className?: string;
}

const SurveyProgress: React.FC<SurveyProgressProps> = ({ className = '' }) => {
  const { currentStep, totalSteps, isStepComplete } = useSurvey();

  const steps = [
    { number: 1, label: 'Personal' },
    { number: 2, label: 'Alimentación' },
    { number: 3, label: 'Metas' },
    { number: 4, label: 'Fitness' },
    { number: 5, label: 'Médico' },
    { number: 6, label: 'Hábitos' },
    { number: 7, label: 'Final' }
  ];

  return (
    <div className={`flex justify-between items-center ${className}`}>
      {steps.map((step) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number || isStepComplete(step.number);
        const isLast = step.number === totalSteps;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive ? 'bg-blue-600 text-white' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-600' : ''}
                `}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <span className="text-xs mt-1 text-gray-600">{step.label}</span>
            </div>
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2">
                <div
                  className={`h-full ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SurveyProgress;
