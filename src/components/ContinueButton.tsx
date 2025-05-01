import React from 'react';
import { useSurvey } from '../context/SurveyContext';

interface ContinueButtonProps {
  message: string;
  onContinue: () => void;
  disabled?: boolean;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ message, onContinue, disabled = false }) => {
  return (
    <div className="flex flex-col items-center space-y-4 mt-6">
      <p className="text-gray-600 text-center">
        {message}
      </p>
      <button
        type="button"
        onClick={onContinue}
        disabled={disabled}
        className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
          disabled
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        Continuar
      </button>
    </div>
  );
};

export default ContinueButton; 