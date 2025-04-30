import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { MedicalHistoryData } from '../../validationSchemas';

type CondicionCronicaType = MedicalHistoryData['condicionesCronicas'][number];
type MedicamentoType = string;

const MedicalHistory: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();

  const handleMultiSelect = (
    name: 'condicionesCronicas' | 'medicamentos',
    value: CondicionCronicaType | MedicamentoType
  ) => {
    const currentValues = (surveyData.medicalHistory[name] || []) as Array<CondicionCronicaType | MedicamentoType>;
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    updateSurveyData({
      medicalHistory: {
        ...surveyData.medicalHistory,
        [name]: newValues
      }
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSurveyData({
      medicalHistory: {
        ...surveyData.medicalHistory,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Tienes alguna condición médica crónica?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Diabetes',
            'Hipertensión',
            'Problemas cardíacos',
            'Artritis',
            'Asma',
            'Otro'
          ].map(condicion => (
            <label key={condicion} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={(surveyData.medicalHistory.condicionesCronicas || []).includes(condicion as CondicionCronicaType)}
                onChange={() => handleMultiSelect('condicionesCronicas', condicion as CondicionCronicaType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{condicion}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Tomas algún medicamento regularmente?
        </label>
        <textarea
          name="medicamentos"
          value={surveyData.medicalHistory.medicamentos || ''}
          onChange={handleTextChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Lista los medicamentos que tomas regularmente..."
        />
      </div>

      <div>
        <label htmlFor="lesionesRecientes" className="block text-sm font-medium text-gray-700">
          ¿Has tenido alguna lesión reciente?
        </label>
        <textarea
          id="lesionesRecientes"
          name="lesionesRecientes"
          value={surveyData.medicalHistory.lesionesRecientes || ''}
          onChange={handleTextChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe cualquier lesión o problema físico reciente..."
        />
      </div>

      <div>
        <label htmlFor="antecedentesFamiliares" className="block text-sm font-medium text-gray-700">
          Historial médico familiar
        </label>
        <textarea
          id="antecedentesFamiliares"
          name="antecedentesFamiliares"
          value={surveyData.medicalHistory.antecedentesFamiliares || ''}
          onChange={handleTextChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe cualquier condición médica relevante en tu familia..."
        />
      </div>
    </div>
  );
};

export default MedicalHistory;
