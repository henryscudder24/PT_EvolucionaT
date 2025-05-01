import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import ContinueButton from '../ContinueButton';

const Completion: React.FC = () => {
  const { finishSurvey } = useSurvey();

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Felicidades!
        </h3>
        <p className="text-gray-600 mb-6">
          Has completado la encuesta de salud y bienestar. Con esta información,
          podremos crear un plan personalizado para ayudarte a alcanzar tus objetivos.
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">
          Próximos pasos
        </h4>
        <ul className="text-left space-y-3">
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-2 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-700">
              Revisaremos tu información y crearemos un plan personalizado
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-2 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-700">
              Recibirás un correo electrónico con tu plan en las próximas 24 horas
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-2 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-700">
              Podrás acceder a tu plan y seguimiento en tu perfil
            </span>
          </li>
        </ul>
      </div>

      <ContinueButton
        message="¡Completar encuesta!"
        onContinue={finishSurvey}
      />
    </div>
  );
};

export default Completion;
