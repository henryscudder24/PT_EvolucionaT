import React from 'react';
import { useSurvey } from '../context/SurveyContext';

const SurveyQuestion: React.FC = () => {
  const { currentQuestion, nextQuestion, previousQuestion, currentStep, totalSteps } = useSurvey();

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuestion.text}</h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option: string, index: number) => (
            <button
              key={index}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={nextQuestion}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={previousQuestion}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Anterior
        </button>
        <span className="text-gray-600">
          Pregunta {currentStep} de {totalSteps}
        </span>
        <button
          onClick={nextQuestion}
          disabled={currentStep === totalSteps}
          className={`px-6 py-2 rounded-lg ${
            currentStep === totalSteps
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default SurveyQuestion; 