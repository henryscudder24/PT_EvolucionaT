import type React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { FiCheck } from 'react-icons/fi';

const FitnessLevel: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  // Manejar la selección única
  const handleSingleSelect = (name: string, value: string) => {
    updateSurveyData({ [name]: value });
  };

  // Manejar selección múltiple
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

  // Manejar cambio de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSurveyData({ [name]: value });
  };

  return (
    <div className="survey-step">
      <div className="survey-card">
        <h2 className="survey-title">Nivel de Condición Física y Entrenamiento</h2>
        <p className="survey-subtitle">
          Esta información nos ayuda a crear un plan de entrenamiento adecuado a tu nivel y recursos.
        </p>

        <div className="mb-6">
          <img
            src="/images/fitness/training-levels.jpg"
            alt="Nivel de Condición Física"
            className="w-full max-h-48 object-contain rounded-lg mb-4"
          />
        </div>

        {/* Frecuencia de ejercicio actual */}
        <div className="mb-8">
          <h3 className="survey-question">Frecuencia de ejercicio actual</h3>
          <p className="text-sm text-muted-foreground mb-4">¿Con qué frecuencia haces ejercicio actualmente?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Nunca o casi nunca',
              '1-2 días por semana',
              '3-4 días por semana',
              '5 o más días por semana'
            ].map((frequency) => (
              <div
                key={`frequency-${frequency}`}
                className={`survey-visual-option ${
                  isSelected('exerciseFrequency', frequency.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('exerciseFrequency', frequency.toLowerCase())}
              >
                {isSelected('exerciseFrequency', frequency.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{frequency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tipo de ejercicio preferido */}
        <div className="mb-8">
          <h3 className="survey-question">Tipo de ejercicio preferido</h3>
          <p className="text-sm text-muted-foreground mb-4">Selecciona todas las opciones que te gusten</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Gimnasio con pesas',
              'Cardio (correr, bici, etc.)',
              'CrossFit',
              'Ejercicios en casa',
              'Calistenia',
              'Yoga/Pilates',
              'Deportes de equipo',
              'Natación',
              'HIIT',
              'Entrenamiento funcional',
              'Baile/Zumba',
              'Otro'
            ].map((type) => (
              <div
                key={`type-${type}`}
                className={`survey-visual-option ${
                  isSelected('exerciseType', type.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleMultiSelect('exerciseType', type.toLowerCase())}
              >
                {isSelected('exerciseType', type.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipamiento disponible */}
        <div className="mb-8">
          <h3 className="survey-question">Equipamiento disponible</h3>
          <p className="text-sm text-muted-foreground mb-4">Selecciona todo el equipamiento que tienes disponible</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Sin equipamiento',
              'Mancuernas',
              'Barras',
              'Máquinas',
              'Bandas elásticas',
              'TRX/Suspensión',
              'Bicicleta',
              'Cinta de correr',
              'Kettlebells',
              'Balón medicinal',
              'Banco de pesas',
              'Step'
            ].map((equipment) => (
              <div
                key={`equipment-${equipment}`}
                className={`survey-visual-option ${
                  isSelected('availableEquipment', equipment.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleMultiSelect('availableEquipment', equipment.toLowerCase())}
              >
                {isSelected('availableEquipment', equipment.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{equipment}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tiempo diario disponible */}
        <div className="mb-8">
          <h3 className="survey-question">Tiempo diario disponible para entrenamiento</h3>
          <p className="text-sm text-muted-foreground mb-4">¿Cuánto tiempo puedes dedicar al ejercicio por sesión?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Menos de 30 minutos',
              '30-45 minutos',
              '45-60 minutos',
              'Más de 60 minutos'
            ].map((time) => (
              <div
                key={`time-${time}`}
                className={`survey-visual-option ${
                  isSelected('availableTime', time.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => handleSingleSelect('availableTime', time.toLowerCase())}
              >
                {isSelected('availableTime', time.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lesiones o condiciones médicas */}
        <div>
          <h3 className="survey-question">Lesiones o condiciones médicas previas</h3>
          <p className="text-sm text-muted-foreground mb-4">Menciona cualquier lesión o condición médica que debamos tener en cuenta</p>

          <textarea
            name="medicalConditions"
            value={surveyData.medicalConditions}
            onChange={handleTextChange}
            className="survey-input min-h-[100px]"
            placeholder="Ej: Lesión de rodilla, problemas de espalda, hipertensión..."
          />
          <p className="text-xs text-muted-foreground mt-2">
            Esta información es importante para adaptar los ejercicios a tus necesidades específicas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FitnessLevel;
