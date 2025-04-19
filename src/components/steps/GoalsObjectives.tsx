import type React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { FiCheck } from 'react-icons/fi';

const GoalsObjectives: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  // Manejar la selección de una opción única
  const handleSingleSelect = (name: string, value: string) => {
    updateSurveyData({ [name]: value });
  };

  // Manejar selección de opciones múltiples
  const handleMultiSelect = (name: string, value: string) => {
    const currentValues = surveyData[name as keyof typeof surveyData] as string[];

    if (Array.isArray(currentValues)) {
      if (currentValues.includes(value)) {
        updateSurveyData({
          [name]: currentValues.filter(item => item !== value)
        });
      } else {
        updateSurveyData({
          [name]: [...currentValues, value]
        });
      }
    }
  };

  // Verificar si una opción está seleccionada
  const isSelected = (name: string, value: string) => {
    const values = surveyData[name as keyof typeof surveyData];
    return values === value || (Array.isArray(values) && values.includes(value));
  };

  // Manejar el cambio del nivel de compromiso
  const handleCommitmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    updateSurveyData({ commitmentLevel: value });
  };

  // Descripción del nivel de compromiso
  const getCommitmentDescription = () => {
    switch (surveyData.commitmentLevel) {
      case 1:
        return "Mínimo: Pequeños cambios graduales";
      case 2:
        return "Bajo: Cambios moderados, flexible";
      case 3:
        return "Medio: Balanceado y constante";
      case 4:
        return "Alto: Disciplinado, resultados rápidos";
      case 5:
        return "Extremo: Compromiso total y riguroso";
      default:
        return "Medio: Balanceado y constante";
    }
  };

  return (
    <div className="survey-step">
      <div className="survey-card">
        <h2 className="survey-title">Metas y Objetivos</h2>
        <p className="survey-subtitle">
          Define tus objetivos para que podamos crear un plan específico para tus necesidades.
        </p>

        <div className="mb-6">
          <img
            src="/images/goals/fitness-goals.jpg"
            alt="Metas y Objetivos"
            className="w-full max-h-48 object-contain rounded-lg mb-4"
          />
        </div>

        {/* Objetivo físico principal */}
        <div className="mb-8">
          <h3 className="survey-question">Objetivo físico principal</h3>
          <p className="text-sm text-muted-foreground mb-4">Selecciona tu principal objetivo</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Perder grasa',
              'Ganar músculo',
              'Mejorar resistencia cardiovascular',
              'Mejorar salud general',
              'Ganar fuerza',
              'Mejorar flexibilidad'
            ].map((goal) => (
              <div
                key={`goal-${goal}`}
                className={`survey-visual-option ${
                  isSelected('mainGoal', goal.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('mainGoal', goal.toLowerCase())}
              >
                {isSelected('mainGoal', goal.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tiempo estimado */}
        <div className="mb-8">
          <h3 className="survey-question">Tiempo estimado para alcanzar la meta</h3>
          <p className="text-sm text-muted-foreground mb-4">¿En cuánto tiempo te gustaría alcanzar resultados significativos?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              '1-3 meses',
              '4-6 meses',
              '7-12 meses',
              'Más de un año'
            ].map((time) => (
              <div
                key={`time-${time}`}
                className={`survey-visual-option ${
                  isSelected('timeframe', time.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('timeframe', time.toLowerCase())}
              >
                {isSelected('timeframe', time.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nivel de compromiso */}
        <div className="mb-8">
          <h3 className="survey-question">Nivel de compromiso</h3>
          <p className="text-sm text-muted-foreground mb-4">¿Qué tan comprometido estás con alcanzar tus objetivos?</p>

          <div className="mb-2">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={surveyData.commitmentLevel}
              onChange={handleCommitmentChange}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Mínimo</span>
            <span>Medio</span>
            <span>Extremo</span>
          </div>

          <div className="text-center text-sm font-medium text-primary">
            {getCommitmentDescription()}
          </div>
        </div>

        {/* Preferencia de medición de resultados */}
        <div>
          <h3 className="survey-question">Preferencia de medición de resultados</h3>
          <p className="text-sm text-muted-foreground mb-4">¿Cómo prefieres medir tu progreso?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Peso corporal',
              'Porcentaje de grasa',
              'Fotos de progreso',
              'Rendimiento físico',
              'Medidas corporales',
              'Sensaciones de salud'
            ].map((measure) => (
              <div
                key={`measure-${measure}`}
                className={`survey-visual-option ${
                  isSelected('measurementPreference', measure.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleMultiSelect('measurementPreference', measure.toLowerCase())}
              >
                {isSelected('measurementPreference', measure.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{measure}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsObjectives;
