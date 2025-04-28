import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../../context/SurveyContext';
import { toast } from 'react-hot-toast';

const Completion: React.FC = () => {
  const navigate = useNavigate();
  const { resetSurvey } = useSurvey();

  const handleReturnToProfile = () => {
    resetSurvey();
    navigate('/profile');
    toast.success('¡Encuesta completada con éxito!');
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
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

      <h2 className="text-3xl font-bold mb-4">¡Encuesta Completada!</h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Gracias por completar la encuesta. Ahora podemos crear recomendaciones personalizadas para ti.
      </p>

      <div className="space-y-4">
        <p className="text-gray-700">
          En los próximos días recibirás:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2">
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Plan de alimentación personalizado
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Rutina de ejercicios adaptada a tus necesidades
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Recomendaciones de hábitos saludables
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <button
          onClick={handleReturnToProfile}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Volver al Perfil
        </button>
      </div>
    </div>
  );
};

export default Completion;
