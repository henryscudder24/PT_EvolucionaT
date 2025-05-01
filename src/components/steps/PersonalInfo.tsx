import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { PersonalInfoFormData } from '../../validationSchemas';
import HealthMetrics from './HealthMetrics';
import ContinueButton from '../ContinueButton';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PersonalInfo: React.FC = () => {
  const { surveyData, updateSurveyData, nextStep } = useSurvey();
  const { token } = useAuth();
  const [showMetrics, setShowMetrics] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<any>(null);

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

  const calculateMetrics = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/usuarios/calculate-metrics', {
        edad: surveyData.personalInfo.edad,
        genero: surveyData.personalInfo.genero,
        peso: surveyData.personalInfo.peso,
        altura: surveyData.personalInfo.altura
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHealthMetrics(response.data);
      setShowMetrics(true);
    } catch (error) {
      console.error('Error al calcular métricas:', error);
    }
  };

  const handleContinue = () => {
    if (!showMetrics) {
      calculateMetrics();
    } else {
      nextStep();
    }
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
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
          <option value="prefiero_no_decir">Prefiero no decir</option>
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
          <option value="sedentario">Sedentario (poco o nada de ejercicio)</option>
          <option value="moderado">Moderado (ejercicio ligero 1-3 días/semana)</option>
          <option value="activo">Activo (ejercicio moderado 3-5 días/semana)</option>
          <option value="muy_activo">Muy activo (ejercicio intenso 6-7 días/semana)</option>
          <option value="extremo">Extremadamente activo (atletas, actividad física muy intensa)</option>
        </select>
      </div>

      {showMetrics && healthMetrics && (
        <HealthMetrics
          tmb={healthMetrics.tmb}
          pesoIdeal={healthMetrics.peso_ideal}
          frecuenciaCardiacaMaxima={healthMetrics.frecuencia_cardiaca_maxima}
          pesoActual={healthMetrics.peso_actual}
          diferenciaPeso={healthMetrics.diferencia_peso}
        />
      )}

      <ContinueButton
        message={showMetrics ? "¡Excelente! Conocer tus preferencias nos permitirá crear un plan que realmente disfrutes." : "¡Gran comienzo! Esta información nos ayudará a personalizar tu plan."}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default PersonalInfo;
