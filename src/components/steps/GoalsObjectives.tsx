import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { GoalsObjectivesData } from '../../validationSchemas';
import ContinueButton from '../ContinueButton';

type ObjetivoPrincipalType = GoalsObjectivesData['objetivoPrincipal'][number];
type TiempoMetaType = GoalsObjectivesData['tiempoMeta'];
type MedicionProgresoType = GoalsObjectivesData['medicionProgreso'][number];

const GoalsObjectives: React.FC = () => {
  const { surveyData, updateSurveyData, nextStep } = useSurvey();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateSurveyData({
      goalsObjectives: {
        ...surveyData.goalsObjectives,
        [name]: value
      }
    });
  };

  const handleNivelCompromisoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateSurveyData({
      goalsObjectives: {
        ...surveyData.goalsObjectives,
        nivelCompromiso: value
      }
    });
  };

  const handleObjetivoPrincipalChange = (value: ObjetivoPrincipalType) => {
    const currentValues = surveyData.goalsObjectives.objetivoPrincipal;
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    updateSurveyData({
      goalsObjectives: {
        ...surveyData.goalsObjectives,
        objetivoPrincipal: newValues
      }
    });
  };

  const handleMedicionProgresoChange = (value: MedicionProgresoType) => {
    const currentValues = surveyData.goalsObjectives.medicionProgreso;
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    updateSurveyData({
      goalsObjectives: {
        ...surveyData.goalsObjectives,
        medicionProgreso: newValues
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Cuál es tu objetivo principal? (Selección múltiple)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Pérdida de peso',
            'Ganancia de masa muscular',
            'Mejora de la resistencia',
            'Mejora de la flexibilidad',
            'Mantenimiento de la salud',
            'Rendimiento deportivo'
          ].map(objetivo => (
            <label key={objetivo} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={surveyData.goalsObjectives.objetivoPrincipal.includes(objetivo as ObjetivoPrincipalType)}
                onChange={() => handleObjetivoPrincipalChange(objetivo as ObjetivoPrincipalType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{objetivo}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="tiempoMeta" className="block text-sm font-medium text-gray-700">
          ¿En cuánto tiempo te gustaría alcanzar tu meta?
        </label>
        <select
          id="tiempoMeta"
          name="tiempoMeta"
          value={surveyData.goalsObjectives.tiempoMeta}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="1-3 meses">1-3 meses</option>
          <option value="3-6 meses">3-6 meses</option>
          <option value="6-12 meses">6-12 meses</option>
          <option value="Más de 12 meses">Más de 12 meses</option>
        </select>
      </div>

      <div>
        <label htmlFor="nivelCompromiso" className="block text-sm font-medium text-gray-700">
          Nivel de compromiso (1-5)
        </label>
        <input
          type="range"
          id="nivelCompromiso"
          name="nivelCompromiso"
          min="1"
          max="5"
          value={surveyData.goalsObjectives.nivelCompromiso}
          onChange={handleNivelCompromisoChange}
          className="mt-1 block w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>1 - Bajo</span>
          <span>2</span>
          <span>3 - Medio</span>
          <span>4</span>
          <span>5 - Alto</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Cómo prefieres medir tu progreso?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Peso corporal',
            'Medidas corporales',
            'Tasa metabólica basal (TMB)',
            'IMC (Índice de Masa Corporal)',
            'Relación cintura-cadera (WHR)',
            '1RM y cargas máximas',
            'Frecuencia cardíaca en reposo',
            'Calidad del sueño'
          ].map(medicion => (
            <label key={medicion} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={surveyData.goalsObjectives.medicionProgreso.includes(medicion as MedicionProgresoType)}
                onChange={() => handleMedicionProgresoChange(medicion as MedicionProgresoType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{medicion}</span>
            </label>
          ))}
        </div>
      </div>

      <ContinueButton
        message="¡Muy bien! Tus objetivos son la guía para crear un plan efectivo y personalizado."
        onContinue={nextStep}
      />
    </div>
  );
};

export default GoalsObjectives;
