import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalsObjectivesSchema, type GoalsObjectivesData } from '../../validationSchemas';
import { useSurvey } from '../../context/SurveyContext';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const GoalsObjectives = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const { register, handleSubmit, formState: { errors } } = useForm<GoalsObjectivesData>({
    resolver: zodResolver(goalsObjectivesSchema),
    defaultValues: {
      mainGoal: surveyData.goalsObjectives?.mainGoal || '',
      timeframe: surveyData.goalsObjectives?.timeframe || '',
      commitmentLevel: surveyData.goalsObjectives?.commitmentLevel || 3,
      measurementPreference: surveyData.goalsObjectives?.measurementPreference || [],
    },
  });

  const onSubmit = (data: GoalsObjectivesData) => {
    updateSurveyData({ goalsObjectives: data });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">Metas y Objetivos</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="mainGoal" className="block text-sm font-medium text-gray-700">
            Meta Principal
          </label>
          <select
            id="mainGoal"
            {...register('mainGoal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecciona una meta</option>
            <option value="perder_peso">Perder peso</option>
            <option value="ganar_musculo">Ganar músculo</option>
            <option value="mejorar_salud">Mejorar salud general</option>
            <option value="mantener_peso">Mantener peso actual</option>
            <option value="ninguna">Ninguna meta específica</option>
          </select>
          {errors.mainGoal && (
            <p className="mt-1 text-sm text-red-600">{errors.mainGoal.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
            Plazo
          </label>
          <select
            id="timeframe"
            {...register('timeframe')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecciona un plazo</option>
            <option value="corto_plazo">Corto plazo (1-3 meses)</option>
            <option value="medio_plazo">Medio plazo (3-6 meses)</option>
            <option value="largo_plazo">Largo plazo (6+ meses)</option>
            <option value="ninguno">Sin plazo específico</option>
          </select>
          {errors.timeframe && (
            <p className="mt-1 text-sm text-red-600">{errors.timeframe.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="commitmentLevel" className="block text-sm font-medium text-gray-700">
            Nivel de Compromiso (1-5)
          </label>
          <input
            type="range"
            id="commitmentLevel"
            min="1"
            max="5"
            step="1"
            {...register('commitmentLevel', { valueAsNumber: true })}
            className="mt-1 w-full"
          />
          {errors.commitmentLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.commitmentLevel.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferencias de Medición
          </label>
          <div className="mt-2 space-y-2">
            {['peso', 'medidas', 'fotos', 'rendimiento'].map((preference) => (
              <div key={preference} className="flex items-center">
                <input
                  type="checkbox"
                  id={preference}
                  value={preference}
                  {...register('measurementPreference')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={preference} className="ml-2 text-sm text-gray-700">
                  {preference.charAt(0).toUpperCase() + preference.slice(1)}
                </label>
              </div>
            ))}
          </div>
          {errors.measurementPreference && (
            <p className="mt-1 text-sm text-red-600">{errors.measurementPreference.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Guardar
        </button>
      </form>
    </motion.div>
  );
};

export default GoalsObjectives;
