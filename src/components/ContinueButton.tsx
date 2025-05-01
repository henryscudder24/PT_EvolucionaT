import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import { toast } from 'react-hot-toast';

interface ContinueButtonProps {
  message: string;
  onContinue: () => void;
  disabled?: boolean;
  buttonText?: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  message,
  onContinue,
  disabled = false,
  buttonText = 'Continuar'
}) => {
  const { currentStep, isStepComplete, prevStep } = useSurvey();

  const handleClick = () => {
    if (!isStepComplete(currentStep)) {
      toast.error('Por favor, completa todos los campos requeridos antes de continuar', {
        duration: 4000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5',
        },
      });
      return;
    }
    onContinue();
  };

  return (
    <div className="mt-8">
      <p className="text-gray-600 mb-4">{message}</p>
      <div className="flex gap-4">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="w-1/3 py-3 px-4 rounded-md text-gray-700 font-medium transition-colors
              bg-gray-200 hover:bg-gray-300"
          >
            Atrás
          </button>
        )}
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`${currentStep > 1 ? 'w-2/3' : 'w-full'} py-3 px-4 rounded-md text-white font-medium transition-colors
            ${disabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-dark'
            }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ContinueButton; 