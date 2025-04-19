import type React from 'react';
import { useSurvey } from '../context/SurveyContext';

const SurveyProgress: React.FC = () => {
  const { currentStep, totalSteps } = useSurvey();
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Definir los nombres de los pasos
  const stepNames = [
    'Información Personal',
    'Preferencias Alimentarias',
    'Metas y Objetivos',
    'Condición Física',
    'Historial Médico',
    'Hábitos Diarios'
  ];

  return (
    <div className="mb-8">
      <div className="survey-progress">
        <div
          className="survey-progress-bar"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between mb-2 overflow-x-auto pb-2">
        {stepNames.map((stepName, index) => (
          <div
            key={`step-${index + 1}-${stepName}`}
            className={`flex flex-col items-center flex-shrink-0 px-1 ${
              index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-muted'
              }`}
            >
              {index + 1}
            </div>
            <p className="text-xs mt-1 whitespace-nowrap">{stepName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyProgress;
