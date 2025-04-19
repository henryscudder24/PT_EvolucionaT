import type React from 'react';
import { useSurvey } from '../../context/SurveyContext';

const PersonalInfo: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  // Actualizar campo en los datos de la encuesta
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateSurveyData({ [name]: value });
  };

  // Validación de entrada numérica
  const validateNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Validar que solo se ingresen números
    if (value === '' || /^\d+$/.test(value)) {
      updateSurveyData({ [name]: value });
    }
  };

  return (
    <div className="survey-step">
      <div className="survey-card">
        <h2 className="survey-title">Información Personal Básica</h2>
        <p className="survey-subtitle">
          Esta información es fundamental para crear recomendaciones personalizadas para ti.
        </p>

        <div className="mb-6">
          <img
            src="/images/personal/personal-info.jpg"
            alt="Información Personal"
            className="w-full max-h-48 object-contain rounded-lg mb-4"
          />
        </div>

        <div className="space-y-6">
          {/* Género */}
          <div>
            <label htmlFor="gender" className="survey-question">
              Género
            </label>
            <select
              id="gender"
              name="gender"
              value={surveyData.gender}
              onChange={handleInputChange}
              className="survey-select"
              required
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </select>
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="age" className="survey-question">
              Edad (años)
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="15"
              max="100"
              value={surveyData.age}
              onChange={validateNumberInput}
              className="survey-input"
              placeholder="Ej: 35"
              required
            />
          </div>

          {/* Altura */}
          <div>
            <label htmlFor="height" className="survey-question">
              Altura (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              min="100"
              max="250"
              value={surveyData.height}
              onChange={validateNumberInput}
              className="survey-input"
              placeholder="Ej: 175"
              required
            />
          </div>

          {/* Peso */}
          <div>
            <label htmlFor="weight" className="survey-question">
              Peso (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              min="30"
              max="300"
              value={surveyData.weight}
              onChange={validateNumberInput}
              className="survey-input"
              placeholder="Ej: 70"
              required
            />
          </div>

          {/* Nivel de actividad física */}
          <div>
            <label htmlFor="activityLevel" className="survey-question">
              Nivel actual de actividad física
            </label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={surveyData.activityLevel}
              onChange={handleInputChange}
              className="survey-select"
              required
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="sedentario">Sedentario (poco o nada de ejercicio)</option>
              <option value="moderado">Moderado (ejercicio ligero 1-3 días/semana)</option>
              <option value="activo">Activo (ejercicio moderado 3-5 días/semana)</option>
              <option value="muy_activo">Muy activo (ejercicio intenso 6-7 días/semana)</option>
              <option value="extremo">
                Extremadamente activo (atletas, actividad física muy intensa)
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
