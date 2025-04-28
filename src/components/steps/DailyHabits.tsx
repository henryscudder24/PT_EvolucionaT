import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { dailyHabitsSchema, type DailyHabitsData } from '../../validationSchemas';
import { useSurvey } from '../../context/SurveyContext';
import { toast } from 'react-hot-toast';

const DailyHabits: React.FC = () => {
  const { surveyData, updateSurveyData, nextStep, prevStep } = useSurvey();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<DailyHabitsData>({
    resolver: zodResolver(dailyHabitsSchema),
    defaultValues: {
      sleepSchedule: surveyData.dailyHabits?.sleepSchedule || '',
      stressLevel: surveyData.dailyHabits?.stressLevel || '',
      workSchedule: surveyData.dailyHabits?.workSchedule || '',
      dietaryRestrictions: surveyData.dailyHabits?.dietaryRestrictions || [],
      mealPreparationTime: surveyData.dailyHabits?.mealPreparationTime || '',
      snackingHabits: surveyData.dailyHabits?.snackingHabits || '',
      waterIntake: surveyData.dailyHabits?.waterIntake || ''
    }
  });

  const onSubmit = (data: DailyHabitsData) => {
    updateSurveyData({ dailyHabits: data });
    nextStep();
    toast.success('Hábitos diarios guardados');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">Hábitos Diarios</h2>
      <p className="text-gray-600">
        Tus hábitos diarios tienen un gran impacto en tu salud y bienestar general.
        Esta información nos ayudará a personalizar aún más tus recomendaciones.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Horario de sueño */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Cuál es tu horario habitual de sueño?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {[
              'Temprano (21:00-05:00)',
              'Normal (22:00-06:00)',
              'Tarde (23:00-07:00)',
              'Muy tarde (00:00-08:00)',
              'Irregular'
            ].map((schedule) => (
              <label
                key={`sleep-${schedule}`}
                className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watch('sleepSchedule') === schedule
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                <input
                  type="radio"
                  value={schedule}
                  {...register('sleepSchedule')}
                  className="sr-only"
                />
                {watch('sleepSchedule') === schedule && (
                  <span className="absolute top-1 right-1 text-indigo-600">
                    <FiCheck size={18} />
                  </span>
                )}
                <span className="text-sm">{schedule}</span>
              </label>
            ))}
          </div>
          {errors.sleepSchedule && (
            <p className="mt-1 text-sm text-red-600">{errors.sleepSchedule.message}</p>
          )}
        </div>

        {/* Nivel de estrés */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Cómo describirías tu nivel habitual de estrés?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {[
              'Bajo',
              'Moderado',
              'Alto',
              'Muy alto',
              'Variable'
            ].map((stress) => (
              <label
                key={`stress-${stress}`}
                className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watch('stressLevel') === stress
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                <input
                  type="radio"
                  value={stress}
                  {...register('stressLevel')}
                  className="sr-only"
                />
                {watch('stressLevel') === stress && (
                  <span className="absolute top-1 right-1 text-indigo-600">
                    <FiCheck size={18} />
                  </span>
                )}
                <span className="text-sm">{stress}</span>
              </label>
            ))}
          </div>
          {errors.stressLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.stressLevel.message}</p>
          )}
        </div>

        {/* Horario de trabajo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Cuál es tu horario de trabajo habitual?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {[
              'Tiempo completo (9-5)',
              'Medio tiempo',
              'Turnos rotativos',
              'Trabajo remoto',
              'Horario flexible',
              'No trabajo actualmente'
            ].map((schedule) => (
              <label
                key={`work-${schedule}`}
                className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watch('workSchedule') === schedule
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                <input
                  type="radio"
                  value={schedule}
                  {...register('workSchedule')}
                  className="sr-only"
                />
                {watch('workSchedule') === schedule && (
                  <span className="absolute top-1 right-1 text-indigo-600">
                    <FiCheck size={18} />
                  </span>
                )}
                <span className="text-sm">{schedule}</span>
              </label>
            ))}
          </div>
          {errors.workSchedule && (
            <p className="mt-1 text-sm text-red-600">{errors.workSchedule.message}</p>
          )}
        </div>

        {/* Tiempo para preparar comidas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Cuánto tiempo sueles dedicar a preparar tus comidas?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {[
              'Menos de 15 minutos',
              '15-30 minutos',
              '30-60 minutos',
              'Más de 60 minutos'
            ].map((time) => (
              <label
                key={`prep-${time}`}
                className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watch('mealPreparationTime') === time
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                <input
                  type="radio"
                  value={time}
                  {...register('mealPreparationTime')}
                  className="sr-only"
                />
                {watch('mealPreparationTime') === time && (
                  <span className="absolute top-1 right-1 text-indigo-600">
                    <FiCheck size={18} />
                  </span>
                )}
                <span className="text-sm">{time}</span>
              </label>
            ))}
          </div>
          {errors.mealPreparationTime && (
            <p className="mt-1 text-sm text-red-600">{errors.mealPreparationTime.message}</p>
          )}
        </div>

        {/* Hábitos de snacking */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Con qué frecuencia consumes snacks entre comidas?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {[
              'Nunca',
              'Ocasionalmente',
              'Regularmente',
              'Frecuentemente'
            ].map((frequency) => (
              <label
                key={`snack-${frequency}`}
                className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watch('snackingHabits') === frequency
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                <input
                  type="radio"
                  value={frequency}
                  {...register('snackingHabits')}
                  className="sr-only"
                />
                {watch('snackingHabits') === frequency && (
                  <span className="absolute top-1 right-1 text-indigo-600">
                    <FiCheck size={18} />
                  </span>
                )}
                <span className="text-sm">{frequency}</span>
              </label>
            ))}
          </div>
          {errors.snackingHabits && (
            <p className="mt-1 text-sm text-red-600">{errors.snackingHabits.message}</p>
          )}
        </div>

        {/* Consumo de agua */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Cuánta agua bebes diariamente?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {[
              'Menos de 1 litro',
              '1-2 litros',
              '2-3 litros',
              'Más de 3 litros'
            ].map((water) => (
              <label
                key={`water-${water}`}
                className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watch('waterIntake') === water
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                <input
                  type="radio"
                  value={water}
                  {...register('waterIntake')}
                  className="sr-only"
                />
                {watch('waterIntake') === water && (
                  <span className="absolute top-1 right-1 text-indigo-600">
                    <FiCheck size={18} />
                  </span>
                )}
                <span className="text-sm">{water}</span>
              </label>
            ))}
          </div>
          {errors.waterIntake && (
            <p className="mt-1 text-sm text-red-600">{errors.waterIntake.message}</p>
          )}
        </div>

        {/* Restricciones dietéticas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ¿Tienes alguna restricción dietética?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {[
              'Vegetariano',
              'Vegano',
              'Sin gluten',
              'Sin lácteos',
              'Sin azúcar',
              'Bajo en carbohidratos',
              'Ninguna'
            ].map((restriction) => (
              <label
                key={`diet-${restriction}`}
                className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watch('dietaryRestrictions')?.includes(restriction)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                <input
                  type="checkbox"
                  value={restriction}
                  {...register('dietaryRestrictions')}
                  className="sr-only"
                />
                {watch('dietaryRestrictions')?.includes(restriction) && (
                  <span className="absolute top-1 right-1 text-indigo-600">
                    <FiCheck size={18} />
                  </span>
                )}
                <span className="text-sm">{restriction}</span>
              </label>
            ))}
          </div>
          {errors.dietaryRestrictions && (
            <p className="mt-1 text-sm text-red-600">{errors.dietaryRestrictions.message}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Siguiente
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default DailyHabits;
