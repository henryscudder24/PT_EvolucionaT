import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { PersonalInfoFormData } from '../../validationSchemas';

const PersonalInfo: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = ['edad', 'altura', 'peso'].includes(name) ? Number(value) : value;
    
    updateSurveyData({
      personalInfo: {
        ...surveyData.personalInfo,
        [name]: numValue
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
          ¿Cuál es tu género?
        </label>
        <select
          id="genero"
          name="genero"
          value={surveyData.personalInfo.genero}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
          <option value="Prefiero no decir">Prefiero no decir</option>
        </select>
      </div>

      <div>
        <label htmlFor="edad" className="block text-sm font-medium text-gray-700">
          ¿Cuál es tu edad? (15-100 años)
        </label>
        <input
          type="number"
          id="edad"
          name="edad"
          min="15"
          max="100"
          value={surveyData.personalInfo.edad}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="altura" className="block text-sm font-medium text-gray-700">
          ¿Cuál es tu altura? (100-250 cm)
        </label>
        <input
          type="number"
          id="altura"
          name="altura"
          min="100"
          max="250"
          value={surveyData.personalInfo.altura}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
          ¿Cuál es tu peso? (30-300 kg)
        </label>
        <input
          type="number"
          id="peso"
          name="peso"
          min="30"
          max="300"
          value={surveyData.personalInfo.peso}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="nivelActividad" className="block text-sm font-medium text-gray-700">
          ¿Cuál es tu nivel actual de actividad física?
        </label>
        <select
          id="nivelActividad"
          name="nivelActividad"
          value={surveyData.personalInfo.nivelActividad}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Sedentario">Sedentario (poco o nada de ejercicio)</option>
          <option value="Moderado">Moderado (ejercicio ligero 1-3 días/semana)</option>
          <option value="Activo">Activo (ejercicio moderado 3-5 días/semana)</option>
          <option value="Muy activo">Muy activo (ejercicio intenso 6-7 días/semana)</option>
          <option value="Extremadamente activo">Extremadamente activo (atletas, actividad física muy intensa)</option>
        </select>
      </div>
    </div>
  );
};

export default PersonalInfo;
