import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { medicalHistorySchema, MedicalHistoryData } from '../../validationSchemas';
import { useSurvey } from '../../context/SurveyContext';

const MedicalHistory: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const [showMedications, setShowMedications] = useState(surveyData.medicalHistory?.takingMedication || false);
  const [showAdditionalNotes, setShowAdditionalNotes] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MedicalHistoryData>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      hasChronicConditions: surveyData.medicalHistory?.hasChronicConditions || false,
      chronicConditions: surveyData.medicalHistory?.chronicConditions || [],
      takingMedication: surveyData.medicalHistory?.takingMedication || false,
      medications: surveyData.medicalHistory?.medications || '',
      recentInjuries: surveyData.medicalHistory?.recentInjuries || [],
      familyHistoryIssues: surveyData.medicalHistory?.familyHistoryIssues || [],
      allergies: surveyData.medicalHistory?.allergies || [],
      additionalNotes: surveyData.medicalHistory?.additionalNotes || '',
    },
  });

  // Observar cambios en los campos y actualizar los datos
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        updateSurveyData({ medicalHistory: value as MedicalHistoryData });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSurveyData]);

  const handleCheckboxChange = (field: keyof MedicalHistoryData, value: string) => {
    const currentValues = watch(field) as string[];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    setValue(field, updatedValues);
    updateSurveyData({ medicalHistory: { ...watch(), [field]: updatedValues } as MedicalHistoryData });
  };

  const handleRadioChange = (name: keyof MedicalHistoryData, value: boolean) => {
    setValue(name, value);
    updateSurveyData({ medicalHistory: { ...watch(), [name]: value } as MedicalHistoryData });
    
    // Si se selecciona "No" en condiciones crónicas, limpiar las condiciones seleccionadas
    if (name === 'hasChronicConditions' && !value) {
      setValue('chronicConditions', []);
      updateSurveyData({ medicalHistory: { ...watch(), chronicConditions: [] } as MedicalHistoryData });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">Historial Médico</h2>
      <p className="text-gray-600">
        Esta información es importante para adaptar nuestras recomendaciones a tu situación médica particular.
        Toda la información proporcionada se mantendrá confidencial.
      </p>

      <form className="space-y-6">
        {/* Condiciones crónicas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Tienes alguna condición crónica?
          </label>
          <div className="mt-2 space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="hasChronicConditions"
                checked={watch('hasChronicConditions') === true}
                onChange={() => handleRadioChange('hasChronicConditions', true)}
                className="form-radio"
              />
              <span className="ml-2">Sí</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="hasChronicConditions"
                checked={watch('hasChronicConditions') === false}
                onChange={() => handleRadioChange('hasChronicConditions', false)}
                className="form-radio"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {watch('hasChronicConditions') && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Selecciona las condiciones que padeces:</p>
              {[
                'Diabetes',
                'Hipertensión',
                'Problemas cardíacos',
                'Problemas respiratorios',
                'Problemas articulares',
                'Otros',
              ].map((condition) => (
                <label key={condition} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={watch('chronicConditions').includes(condition)}
                    onChange={() => handleCheckboxChange('chronicConditions', condition)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{condition}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Medicamentos */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Estás tomando algún medicamento actualmente?
          </label>
          <div className="mt-2 space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="takingMedication"
                checked={watch('takingMedication') === true}
                onChange={() => handleRadioChange('takingMedication', true)}
                className="form-radio"
              />
              <span className="ml-2">Sí</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="takingMedication"
                checked={watch('takingMedication') === false}
                onChange={() => handleRadioChange('takingMedication', false)}
                className="form-radio"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {watch('takingMedication') && (
            <div className="mt-2">
              <textarea
                {...register('medications')}
                className="form-textarea mt-1 block w-full"
                placeholder="Por favor, especifica los medicamentos que estás tomando"
                onChange={(e) => {
                  setValue('medications', e.target.value);
                  updateSurveyData({ medicalHistory: { ...watch(), medications: e.target.value } as MedicalHistoryData });
                }}
              />
            </div>
          )}
        </div>

        {/* Lesiones recientes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Has tenido alguna lesión reciente?
          </label>
          <div className="mt-2 space-y-2">
            {[
              'Lesión de rodilla',
              'Lesión de espalda',
              'Lesión de hombro',
              'Lesión de tobillo',
              'Ninguna',
            ].map((injury) => (
              <label key={injury} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={watch('recentInjuries').includes(injury)}
                  onChange={() => handleCheckboxChange('recentInjuries', injury)}
                  className="form-checkbox"
                />
                <span className="ml-2">{injury}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Historial familiar */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Hay algún problema de salud en tu familia que debamos tener en cuenta?
          </label>
          <div className="mt-2 space-y-2">
            {[
              'Problemas cardíacos',
              'Diabetes',
              'Hipertensión',
              'Obesidad',
              'Ninguno',
            ].map((issue) => (
              <label key={issue} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={watch('familyHistoryIssues').includes(issue)}
                  onChange={() => handleCheckboxChange('familyHistoryIssues', issue)}
                  className="form-checkbox"
                />
                <span className="ml-2">{issue}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Alergias */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Tienes alguna alergia?
          </label>
          <div className="mt-2 space-y-2">
            {[
              'Alimentaria',
              'Medicamentos',
              'Polen',
              'Ácaros',
              'Ninguna',
            ].map((allergy) => (
              <label key={allergy} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={watch('allergies').includes(allergy)}
                  onChange={() => handleCheckboxChange('allergies', allergy)}
                  className="form-checkbox"
                />
                <span className="ml-2">{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notas adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Hay algo más que debamos saber sobre tu salud?
          </label>
          <div className="mt-2">
            <textarea
              {...register('additionalNotes')}
              className="form-textarea mt-1 block w-full"
              placeholder="Cualquier información adicional que consideres relevante"
              onChange={(e) => {
                setValue('additionalNotes', e.target.value);
                updateSurveyData({ medicalHistory: { ...watch(), additionalNotes: e.target.value } as MedicalHistoryData });
              }}
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default MedicalHistory;
