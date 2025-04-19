import type React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { FiCheck } from 'react-icons/fi';

const MedicalHistory: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  // Manejar cambio en opciones booleanas
  const handleBooleanChange = (name: string, value: boolean) => {
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

  // Manejar cambio de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSurveyData({ [name]: value });
  };

  // Verificar si una opción está seleccionada
  const isSelected = (name: string, value: string) => {
    const values = surveyData[name as keyof typeof surveyData];
    return Array.isArray(values) && values.includes(value);
  };

  return (
    <div className="survey-step">
      <div className="survey-card">
        <h2 className="survey-title">Historial Médico</h2>
        <p className="survey-subtitle">
          Esta información es importante para adaptar nuestras recomendaciones a tu situación médica particular.
          Toda la información proporcionada se mantendrá confidencial.
        </p>

        <div className="mb-6">
          <img
            src="/images/personal/medical-history.jpg"
            alt="Historial Médico"
            className="w-full max-h-48 object-contain rounded-lg mb-4"
          />
        </div>

        {/* Condiciones crónicas */}
        <div className="mb-8">
          <h3 className="survey-question">¿Tienes alguna condición crónica diagnosticada?</h3>

          <div className="flex gap-4 mt-2 mb-4">
            <div
              className={`survey-visual-option flex-1 ${surveyData.hasChronicConditions ? 'survey-visual-option-selected' : ''}`}
              onClick={() => handleBooleanChange('hasChronicConditions', true)}
            >
              {surveyData.hasChronicConditions && (
                <span className="text-primary">
                  <FiCheck size={18} />
                </span>
              )}
              <span>Sí</span>
            </div>
            <div
              className={`survey-visual-option flex-1 ${surveyData.hasChronicConditions === false ? 'survey-visual-option-selected' : ''}`}
              onClick={() => handleBooleanChange('hasChronicConditions', false)}
            >
              {surveyData.hasChronicConditions === false && (
                <span className="text-primary">
                  <FiCheck size={18} />
                </span>
              )}
              <span>No</span>
            </div>
          </div>

          {surveyData.hasChronicConditions && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-3">Selecciona las condiciones que apliquen:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Hipertensión',
                  'Diabetes',
                  'Asma',
                  'Artritis',
                  'Enfermedad cardíaca',
                  'Problemas digestivos',
                  'Tiroides',
                  'Colesterol alto',
                  'Otra'
                ].map((condition) => (
                  <div
                    key={`condition-${condition}`}
                    className={`survey-visual-option ${
                      isSelected('chronicConditions', condition.toLowerCase()) ? 'survey-visual-option-selected' : ''
                    }`}
                    onClick={() => handleMultiSelect('chronicConditions', condition.toLowerCase())}
                  >
                    {isSelected('chronicConditions', condition.toLowerCase()) && (
                      <span className="text-primary">
                        <FiCheck size={18} />
                      </span>
                    )}
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Medicamentos */}
        <div className="mb-8">
          <h3 className="survey-question">¿Tomas algún medicamento regularmente?</h3>

          <div className="flex gap-4 mt-2 mb-4">
            <div
              className={`survey-visual-option flex-1 ${surveyData.takingMedication ? 'survey-visual-option-selected' : ''}`}
              onClick={() => handleBooleanChange('takingMedication', true)}
            >
              {surveyData.takingMedication && (
                <span className="text-primary">
                  <FiCheck size={18} />
                </span>
              )}
              <span>Sí</span>
            </div>
            <div
              className={`survey-visual-option flex-1 ${surveyData.takingMedication === false ? 'survey-visual-option-selected' : ''}`}
              onClick={() => handleBooleanChange('takingMedication', false)}
            >
              {surveyData.takingMedication === false && (
                <span className="text-primary">
                  <FiCheck size={18} />
                </span>
              )}
              <span>No</span>
            </div>
          </div>

          {surveyData.takingMedication && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-3">Por favor, enumera los medicamentos que tomas:</p>
              <textarea
                name="medications"
                value={surveyData.medications}
                onChange={handleTextChange}
                className="survey-input min-h-[80px]"
                placeholder="Ej: Metformina, Aspirina, etc."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Esta información es importante para evitar posibles interacciones con tus recomendaciones nutricionales.
              </p>
            </div>
          )}
        </div>

        {/* Lesiones recientes */}
        <div className="mb-8">
          <h3 className="survey-question">¿Has tenido alguna lesión o cirugía en los últimos 12 meses?</h3>
          <p className="text-sm text-muted-foreground mb-4">Selecciona todas las que apliquen:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Lesión articular (rodilla, tobillo, etc.)',
              'Lesión muscular',
              'Lesión de espalda',
              'Cirugía menor',
              'Cirugía mayor',
              'Fractura ósea',
              'Ninguna'
            ].map((injury) => (
              <div
                key={`injury-${injury}`}
                className={`survey-visual-option ${
                  isSelected('recentInjuries', injury.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => {
                  if (injury === 'Ninguna') {
                    if (!isSelected('recentInjuries', 'ninguna')) {
                      updateSurveyData({ recentInjuries: ['ninguna'] });
                    } else {
                      updateSurveyData({ recentInjuries: [] });
                    }
                  } else {
                    // Si se selecciona algo que no es "Ninguna", eliminar "Ninguna" si está seleccionada
                    if (isSelected('recentInjuries', 'ninguna')) {
                      updateSurveyData({
                        recentInjuries: [injury.toLowerCase()]
                      });
                    } else {
                      handleMultiSelect('recentInjuries', injury.toLowerCase());
                    }
                  }
                }}
              >
                {isSelected('recentInjuries', injury.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{injury}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historial familiar */}
        <div>
          <h3 className="survey-question">Historial de salud familiar</h3>
          <p className="text-sm text-muted-foreground mb-4">¿Hay alguna condición de salud con predisposición genética en tu familia?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Enfermedades cardíacas',
              'Diabetes tipo 2',
              'Hipertensión',
              'Cáncer',
              'Obesidad',
              'Desórdenes autoinmunes',
              'Ninguna conocida'
            ].map((condition) => (
              <div
                key={`family-${condition}`}
                className={`survey-visual-option ${
                  isSelected('familyHistoryIssues', condition.toLowerCase()) ? 'survey-visual-option-selected' : ''
                }`}
                onClick={() => {
                  if (condition === 'Ninguna conocida') {
                    if (!isSelected('familyHistoryIssues', 'ninguna conocida')) {
                      updateSurveyData({ familyHistoryIssues: ['ninguna conocida'] });
                    } else {
                      updateSurveyData({ familyHistoryIssues: [] });
                    }
                  } else {
                    // Si se selecciona algo que no es "Ninguna conocida", eliminar "Ninguna conocida" si está seleccionada
                    if (isSelected('familyHistoryIssues', 'ninguna conocida')) {
                      updateSurveyData({
                        familyHistoryIssues: [condition.toLowerCase()]
                      });
                    } else {
                      handleMultiSelect('familyHistoryIssues', condition.toLowerCase());
                    }
                  }
                }}
              >
                {isSelected('familyHistoryIssues', condition.toLowerCase()) && (
                  <span className="text-primary">
                    <FiCheck size={18} />
                  </span>
                )}
                <span>{condition}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Conocer tu historial familiar nos ayuda a identificar posibles riesgos y adaptar tus recomendaciones de forma preventiva.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
