import type React from 'react';
import { useSurvey } from '../../context/SurveyContext';

const Completion: React.FC = () => {
  const { surveyData } = useSurvey();

  // Función para formatear los arrays como lista
  const formatList = (items: string[]) => {
    if (!items || items.length === 0) return 'Ninguno';
    return items.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(', ');
  };

  return (
    <div className="survey-step">
      <div className="survey-card">
        <h2 className="survey-title text-center">¡Gracias por completar la encuesta!</h2>
        <div className="flex justify-center my-8">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary"
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
        </div>
        <p className="survey-subtitle text-center mb-8">
          Hemos recibido tus respuestas y estamos creando un plan personalizado para ti.
          <br />
          <span className="text-primary font-medium">
            Pronto recibirás tus recomendaciones personalizadas de dieta y entrenamiento.
          </span>
        </p>

        <div className="bg-muted/50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Resumen de tus respuestas:</h3>

          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">Información Personal</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Género: {surveyData.gender ? surveyData.gender.charAt(0).toUpperCase() + surveyData.gender.slice(1) : 'No especificado'}</li>
                <li>Edad: {surveyData.age || 'No especificada'} años</li>
                <li>Altura: {surveyData.height || 'No especificada'} cm</li>
                <li>Peso: {surveyData.weight || 'No especificado'} kg</li>
                <li>Nivel de actividad: {surveyData.activityLevel ? surveyData.activityLevel.charAt(0).toUpperCase() + surveyData.activityLevel.slice(1) : 'No especificado'}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Preferencias Alimentarias</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Tipo de dieta: {formatList(surveyData.dietType)}</li>
                <li>Alergias/Restricciones: {formatList(surveyData.allergies)}</li>
                <li>Comidas favoritas: {formatList(surveyData.favoriteFoods)}</li>
                <li>Alimentos a evitar: {surveyData.foodsToAvoid || 'Ninguno especificado'}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Metas y Objetivos</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Objetivo principal: {surveyData.mainGoal ? surveyData.mainGoal.charAt(0).toUpperCase() + surveyData.mainGoal.slice(1) : 'No especificado'}</li>
                <li>Tiempo para alcanzar meta: {surveyData.timeframe || 'No especificado'}</li>
                <li>Nivel de compromiso: {surveyData.commitmentLevel}/5</li>
                <li>Preferencia de medición: {formatList(surveyData.measurementPreference)}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Condición Física</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Frecuencia de ejercicio: {surveyData.exerciseFrequency || 'No especificada'}</li>
                <li>Tipos de ejercicio preferidos: {formatList(surveyData.exerciseType)}</li>
                <li>Equipamiento disponible: {formatList(surveyData.availableEquipment)}</li>
                <li>Tiempo disponible: {surveyData.availableTime || 'No especificado'}</li>
                <li>Condiciones médicas: {surveyData.medicalConditions || 'Ninguna reportada'}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-8">
          <button className="survey-button-primary px-8">
            Ir a mi dashboard
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            Recibirás un email con tus resultados en las próximas 24 horas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Completion;
