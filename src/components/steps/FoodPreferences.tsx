import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { foodPreferencesSchema, FoodPreferencesData } from '../../validationSchemas';
import { useSurvey } from '../../context/SurveyContext';
import { motion } from 'framer-motion';

const FoodPreferences: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FoodPreferencesData>({
    resolver: zodResolver(foodPreferencesSchema),
    defaultValues: {
      tipoDieta: surveyData.foodPreferences.tipoDieta || [],
      alergias: surveyData.foodPreferences.alergias || [],
      alimentosEvitados: surveyData.foodPreferences.alimentosEvitados || [],
      frecuenciaComida: surveyData.foodPreferences.frecuenciaComida || '',
    },
  });

  // Observar cambios en los campos y actualizar los datos
  React.useEffect(() => {
    const subscription = watch((value) => {
      updateSurveyData({ foodPreferences: value as FoodPreferencesData });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSurveyData]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferencias Alimentarias</h2>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de dieta
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Vegetariana',
              'Vegana',
              'Omnívora',
              'Paleo',
              'Keto',
              'Mediterránea',
              'Ninguna específica',
            ].map((dieta) => (
              <label key={dieta} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value={dieta}
                  {...register('tipoDieta')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{dieta}</span>
              </label>
            ))}
          </div>
          {errors.tipoDieta && (
            <p className="mt-1 text-sm text-red-600">{errors.tipoDieta.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alergias alimentarias
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Lácteos',
              'Gluten',
              'Frutos secos',
              'Mariscos',
              'Huevos',
              'Soja',
              'Ninguna',
            ].map((alergia) => (
              <label key={alergia} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value={alergia}
                  {...register('alergias')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{alergia}</span>
              </label>
            ))}
          </div>
          {errors.alergias && (
            <p className="mt-1 text-sm text-red-600">{errors.alergias.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alimentos que prefieres evitar
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Azúcar',
              'Grasas saturadas',
              'Carbohidratos',
              'Carnes rojas',
              'Alimentos procesados',
              'Ninguno',
            ].map((alimento) => (
              <label key={alimento} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value={alimento}
                  {...register('alimentosEvitados')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{alimento}</span>
              </label>
            ))}
          </div>
          {errors.alimentosEvitados && (
            <p className="mt-1 text-sm text-red-600">{errors.alimentosEvitados.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frecuencia de comidas al día
          </label>
          <select
            {...register('frecuenciaComida')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona una opción</option>
            <option value="3">3 comidas principales</option>
            <option value="4">3 comidas principales + 1 snack</option>
            <option value="5">3 comidas principales + 2 snacks</option>
            <option value="6">6 comidas pequeñas</option>
            <option value="variable">Variable según el día</option>
          </select>
          {errors.frecuenciaComida && (
            <p className="mt-1 text-sm text-red-600">{errors.frecuenciaComida.message}</p>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default FoodPreferences;
