import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { personalInfoFormSchema, PersonalInfoFormData } from '../validationSchemas';
import { useSurvey } from '../context/SurveyContext';
import { toast } from 'react-hot-toast';

const PersonalInfo: React.FC = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const { register, handleSubmit, formState: { errors } } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues: {
      nombre: surveyData.personalInfo.nombre || '',
      genero: surveyData.personalInfo.genero || '',
      edad: surveyData.personalInfo.edad ? Number(surveyData.personalInfo.edad) : undefined,
      altura: surveyData.personalInfo.altura ? Number(surveyData.personalInfo.altura) : undefined,
      peso: surveyData.personalInfo.peso ? Number(surveyData.personalInfo.peso) : undefined,
      telefono: surveyData.personalInfo.telefono || ''
    }
  });

  const onSubmit = (data: PersonalInfoFormData) => {
    // Convertir los números a strings para el contexto
    const contextData = {
      ...data,
      edad: data.edad.toString(),
      altura: data.altura.toString(),
      peso: data.peso.toString()
    };
    updateSurveyData({ personalInfo: contextData });
    toast.success('Información personal guardada');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">Información Personal</h2>
      <p className="text-gray-600">
        Por favor, proporciona tu información personal para que podamos crear un plan personalizado.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            {...register('nombre')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Género</label>
          <select
            {...register('genero')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecciona tu género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          {errors.genero && (
            <p className="mt-1 text-sm text-red-600">{errors.genero.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Edad</label>
          <input
            type="number"
            {...register('edad', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.edad && (
            <p className="mt-1 text-sm text-red-600">{errors.edad.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
          <input
            type="number"
            {...register('altura', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.altura && (
            <p className="mt-1 text-sm text-red-600">{errors.altura.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
          <input
            type="number"
            {...register('peso', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.peso && (
            <p className="mt-1 text-sm text-red-600">{errors.peso.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            {...register('telefono')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.telefono && (
            <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Guardar
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PersonalInfo; 