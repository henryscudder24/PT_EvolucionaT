import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { MedicalHistoryData } from '../../validationSchemas';
import ContinueButton from '../ContinueButton';

type CondicionCronicaType = MedicalHistoryData['condicionesCronicas'][number];

const MedicalHistory: React.FC = () => {
  const { surveyData, updateSurveyData, nextStep } = useSurvey();

  const handleMultiSelect = (value: CondicionCronicaType) => {
    const currentValues = surveyData.medicalHistory.condicionesCronicas;
    
    if (value === 'Ninguna') {
      // Si se selecciona 'Ninguna', limpiar todas las demás selecciones
      updateSurveyData({
        medicalHistory: {
          ...surveyData.medicalHistory,
          condicionesCronicas: ['Ninguna'],
          otrasCondiciones: ''
        }
      });
    } else {
      // Si se selecciona otra opción, remover 'Ninguna' si está presente
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues.filter(v => v !== 'Ninguna'), value];

      updateSurveyData({
        medicalHistory: {
          ...surveyData.medicalHistory,
          condicionesCronicas: newValues
        }
      });
    }
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
            'Ninguna',
            'Diabetes',
            'Hipertensión',
            'Problemas cardíacos',
            'Asma',
            'Artritis',
            'Otro'
          ].map(condicion => (
            <label key={condicion} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={surveyData.medicalHistory.condicionesCronicas.includes(condicion as CondicionCronicaType)}
                onChange={() => handleMultiSelect(condicion as CondicionCronicaType)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{condicion}</span>
            </label>
          ))}
        </div>
      </div>

      {surveyData.medicalHistory.condicionesCronicas.includes('Otro' as CondicionCronicaType) && (
        <div>
          <label htmlFor="otrasCondiciones" className="block text-sm font-medium text-gray-700">
            Por favor, especifica otras condiciones médicas
          </label>
          <textarea
            id="otrasCondiciones"
            name="otrasCondiciones"
            value={surveyData.medicalHistory.otrasCondiciones || ''}
            onChange={handleTextChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe tus otras condiciones médicas..."
          />
        </div>
      )}

      <div>
        <label htmlFor="medicamentos" className="block text-sm font-medium text-gray-700">
          ¿Tomas algún medicamento regularmente?
        </label>
        <textarea
          id="medicamentos"
          name="medicamentos"
          value={surveyData.medicalHistory.medicamentos || ''}
          onChange={handleTextChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Lista los medicamentos que tomas..."
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
          placeholder="Describe cualquier lesión reciente..."
        />
      </div>

      <div>
        <label htmlFor="antecedentesFamiliares" className="block text-sm font-medium text-gray-700">
          ¿Hay antecedentes médicos importantes en tu familia?
        </label>
        <textarea
          id="antecedentesFamiliares"
          name="antecedentesFamiliares"
          value={surveyData.medicalHistory.antecedentesFamiliares || ''}
          onChange={handleTextChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe los antecedentes médicos familiares relevantes..."
        />
      </div>

      <ContinueButton
        message="¡Gracias por compartir tu historial médico! Esta información nos ayudará a crear un plan seguro y efectivo."
        onContinue={nextStep}
      />
    </div>
  );
};

export default MedicalHistory;
