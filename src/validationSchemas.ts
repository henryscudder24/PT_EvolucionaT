import { z } from 'zod';

// Schema for form data (numbers)
export const personalInfoFormSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  edad: z.number().min(18, 'Debes tener al menos 18 años').max(100, 'La edad no puede ser mayor a 100 años'),
  genero: z.string().min(1, 'El género es requerido'),
  altura: z.number().min(100, 'La altura debe ser al menos 100 cm').max(250, 'La altura no puede ser mayor a 250 cm'),
  peso: z.number().min(30, 'El peso debe ser al menos 30 kg').max(300, 'El peso no puede ser mayor a 300 kg'),
  telefono: z.string().min(1, 'El teléfono es requerido')
});

// Schema for context data (strings)
export const personalInfoContextSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  edad: z.string().min(1, 'La edad es requerida'),
  genero: z.string().min(1, 'El género es requerido'),
  altura: z.string().min(1, 'La altura es requerida'),
  peso: z.string().min(1, 'El peso es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido')
});

// Schema for food preferences
export const foodPreferencesSchema = z.object({
  tipoDieta: z.array(z.string()).min(1, 'Selecciona al menos un tipo de dieta'),
  alergias: z.array(z.string()),
  alimentosEvitados: z.array(z.string()),
  frecuenciaComida: z.string().min(1, 'Selecciona la frecuencia de comidas')
});

export const goalsObjectivesSchema = z.object({
  mainGoal: z.string().min(1, 'Por favor selecciona una meta principal'),
  timeframe: z.string().min(1, 'Por favor selecciona un plazo'),
  commitmentLevel: z.number().min(1).max(5),
  measurementPreference: z.array(z.string()).min(1, 'Por favor selecciona al menos una preferencia de medición'),
});

export const dailyHabitsSchema = z.object({
  sleepSchedule: z.string().min(1, 'Por favor selecciona tu horario de sueño'),
  stressLevel: z.string().min(1, 'Por favor selecciona tu nivel de estrés'),
  workSchedule: z.string().min(1, 'Por favor selecciona tu horario de trabajo'),
  dietaryRestrictions: z.array(z.string()),
  mealPreparationTime: z.string().min(1, 'Por favor selecciona el tiempo de preparación de comidas'),
  snackingHabits: z.string().min(1, 'Por favor selecciona tus hábitos de snacking'),
  waterIntake: z.string().min(1, 'Por favor selecciona tu consumo de agua'),
});

export const medicalHistorySchema = z.object({
  hasChronicConditions: z.boolean(),
  chronicConditions: z.array(z.string()),
  takingMedication: z.boolean(),
  medications: z.string().optional(),
  recentInjuries: z.array(z.string()),
  familyHistoryIssues: z.array(z.string()),
  allergies: z.array(z.string()),
  additionalNotes: z.string().optional(),
});

// Schema for fitness level
export const fitnessLevelSchema = z.object({
  exerciseFrequency: z.string().min(1, 'Por favor selecciona la frecuencia de ejercicio'),
  exerciseType: z.array(z.string()).min(1, 'Por favor selecciona al menos un tipo de ejercicio'),
  availableEquipment: z.array(z.string()),
  availableTime: z.string().min(1, 'Por favor selecciona el tiempo disponible'),
  medicalConditions: z.string(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoFormSchema>;
export type PersonalInfoContextData = z.infer<typeof personalInfoContextSchema>;
export type FoodPreferencesData = z.infer<typeof foodPreferencesSchema>;
export type GoalsObjectivesData = z.infer<typeof goalsObjectivesSchema>;
export type DailyHabitsData = z.infer<typeof dailyHabitsSchema>;
export type MedicalHistoryData = z.infer<typeof medicalHistorySchema>;
export type FitnessLevelData = z.infer<typeof fitnessLevelSchema>; 