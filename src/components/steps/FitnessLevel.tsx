import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { FitnessLevelData } from '../../validationSchemas';

type FrecuenciaEjercicioType = FitnessLevelData['frecuenciaEjercicio'];
type TipoEjercicioType = FitnessLevelData['tiposEjercicio'][number];
type EquipamientoType = FitnessLevelData['equipamiento'][number];
type TiempoEjercicioType = FitnessLevelData['tiempoEjercicio'];

const FitnessLevel: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateSurveyData({
      fitnessLevel: {
        ...surveyData.fitnessLevel,
        [name]: value
      }
    });
  };

  const handleMultiSelect = (
    name: 'tiposEjercicio' | 'equipamiento',
    value: TipoEjercicioType | EquipamientoType
  ) => {
    const currentValues = surveyData.fitnessLevel[name] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    updateSurveyData({
      fitnessLevel: {
        ...surveyData.fitnessLevel,
        [name]: newValues
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="frecuenciaEjercicio" className="block text-sm font-medium text-gray-700">
          ¿Con qué frecuencia haces ejercicio?
        </label>
        <select
          id="frecuenciaEjercicio"
          name="frecuenciaEjercicio"
          value={surveyData.fitnessLevel.frecuenciaEjercicio}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Nunca">Nunca</option>
          <option value="1-2 veces por semana">1-2 veces por semana</option>
          <option value="3-4 veces por semana">3-4 veces por semana</option>
          <option value="5+ veces por semana">5+ veces por semana</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Qué tipos de ejercicio prefieres?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Cardio',
            'Pesas',
            'Yoga/Pilates',
            'Deportes de equipo',
            'Natación',
            'Ciclismo',
            'Artes marciales'
          ].map(tipo => (
            <label key={tipo} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={surveyData.fitnessLevel.tiposEjercicio.includes(tipo as TipoEjercicioType)}
                onChange={() => handleMultiSelect('tiposEjercicio', tipo as TipoEjercicioType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{tipo}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Qué equipamiento tienes disponible?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Pesas libres',
            'Máquinas de gimnasio',
            'Bandas elásticas',
            'Bicicleta',
            'Ninguno'
          ].map(equipo => (
            <label key={equipo} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={surveyData.fitnessLevel.equipamiento.includes(equipo as EquipamientoType)}
                onChange={() => handleMultiSelect('equipamiento', equipo as EquipamientoType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{equipo}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="tiempoEjercicio" className="block text-sm font-medium text-gray-700">
          ¿Cuánto tiempo puedes dedicar al ejercicio?
        </label>
        <select
          id="tiempoEjercicio"
          name="tiempoEjercicio"
          value={surveyData.fitnessLevel.tiempoEjercicio}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Menos de 30 minutos">Menos de 30 minutos</option>
          <option value="30-60 minutos">30-60 minutos</option>
          <option value="Más de 60 minutos">Más de 60 minutos</option>
        </select>
      </div>
    </div>
  );
};

export default FitnessLevel;
