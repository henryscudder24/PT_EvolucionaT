import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fitnessLevelSchema, type FitnessLevelData } from '../../validationSchemas';
import { useSurvey } from '../../context/SurveyContext';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const FitnessLevel: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FitnessLevelData>({
    resolver: zodResolver(fitnessLevelSchema),
    defaultValues: {
      exerciseFrequency: surveyData.fitnessLevel?.exerciseFrequency || '',
      exerciseType: surveyData.fitnessLevel?.exerciseType || [],
      availableEquipment: surveyData.fitnessLevel?.availableEquipment || [],
      availableTime: surveyData.fitnessLevel?.availableTime || '',
      medicalConditions: surveyData.fitnessLevel?.medicalConditions || '',
    },
  });

  // Observar cambios en los campos y actualizar los datos
  React.useEffect(() => {
    const subscription = watch((value) => {
      updateSurveyData({ fitnessLevel: value as FitnessLevelData });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSurveyData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold mb-6">Nivel de Actividad Física</h2>

      <form className="space-y-6">
        {/* Frecuencia de ejercicio */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            ¿Con qué frecuencia realizas ejercicio?
          </label>
          <select
            {...register('exerciseFrequency')}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecciona una opción</option>
            <option value="nunca">Nunca</option>
            <option value="ocasional">Ocasionalmente</option>
            <option value="1-2-semana">1-2 veces por semana</option>
            <option value="3-4-semana">3-4 veces por semana</option>
            <option value="5+-semana">5 o más veces por semana</option>
          </select>
          {errors.exerciseFrequency && (
            <p className="text-red-500 text-sm">{errors.exerciseFrequency.message}</p>
          )}
        </div>

        {/* Tipos de ejercicio */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            ¿Qué tipos de ejercicio prefieres? (Selecciona todos los que apliquen)
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              'cardio',
              'pesas',
              'yoga',
              'pilates',
              'natacion',
              'deportes-equipo',
              'artes-marciales',
              'baile'
            ].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={type}
                  {...register('exerciseType')}
                  className="rounded"
                />
                <span>{type.replace('-', ' ').charAt(0).toUpperCase() + type.slice(1)}</span>
              </label>
            ))}
          </div>
          {errors.exerciseType && (
            <p className="text-red-500 text-sm">{errors.exerciseType.message}</p>
          )}
        </div>

        {/* Equipo disponible */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            ¿Qué equipo tienes disponible? (Selecciona todos los que apliquen)
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              'pesas',
              'bandas',
              'maquinas',
              'bicicleta',
              'caminadora',
              'colchoneta',
              'ninguno'
            ].map((equipment) => (
              <label key={equipment} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={equipment}
                  {...register('availableEquipment')}
                  className="rounded"
                />
                <span>{equipment.charAt(0).toUpperCase() + equipment.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tiempo disponible */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            ¿Cuánto tiempo puedes dedicar al ejercicio por sesión?
          </label>
          <select
            {...register('availableTime')}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecciona una opción</option>
            <option value="15-min">15 minutos</option>
            <option value="30-min">30 minutos</option>
            <option value="45-min">45 minutos</option>
            <option value="60-min">1 hora</option>
            <option value="90-min">1.5 horas</option>
            <option value="120-min">2 horas o más</option>
          </select>
          {errors.availableTime && (
            <p className="text-red-500 text-sm">{errors.availableTime.message}</p>
          )}
        </div>

        {/* Condiciones médicas */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            ¿Tienes alguna condición médica que afecte tu actividad física?
          </label>
          <textarea
            {...register('medicalConditions')}
            className="w-full p-2 border rounded-md h-24"
            placeholder="Describe cualquier condición médica relevante..."
          />
        </div>
      </form>
    </motion.div>
  );
};

export default FitnessLevel;
