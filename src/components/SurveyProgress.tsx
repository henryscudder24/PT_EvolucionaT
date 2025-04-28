import React from 'react';
import { useSurvey } from '../context/SurveyContext';

interface SurveyProgressProps {
  className?: string;
}

const SurveyProgress: React.FC<SurveyProgressProps> = ({ className = '' }) => {
  const { currentStep, totalSteps } = useSurvey();
  const progress = (currentStep / totalSteps) * 100;

  // Definir los nombres de los pasos
  const stepNames = [
    'Información Personal',
    'Preferencias',
    'Objetivos',
    'Adaptación'
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Progreso: {Math.round(progress)}%
        </span>
        <span className="text-sm font-medium text-gray-700">
          Paso {currentStep} de {totalSteps}
        </span>
      </div>
      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Nombres de los pasos */}
      <div className="flex justify-between text-sm text-gray-600">
        {stepNames.map((name, index) => (
          <div
            key={index}
            className={`text-center ${
              index + 1 <= currentStep
                ? 'text-blue-600 font-medium'
                : 'text-gray-400'
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyProgress;
