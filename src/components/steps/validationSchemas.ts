import { z } from 'zod';

// Schema for form data (numbers)
export const personalInfoFormSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  edad: z.number()
    .min(18, "Debes ser mayor de 18 años")
    .max(100, "La edad no puede ser mayor a 100 años"),
  genero: z.string()
    .min(1, "Debes seleccionar un género"),
  altura: z.number()
    .min(100, "La altura mínima es 100 cm")
    .max(250, "La altura máxima es 250 cm"),
  peso: z.number()
    .min(30, "El peso mínimo es 30 kg")
    .max(300, "El peso máximo es 300 kg"),
  telefono: z.string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(15, "El teléfono no puede tener más de 15 dígitos"),
});

// Schema for context data (strings)
export const personalInfoContextSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  edad: z.string()
    .min(1, "La edad es requerida"),
  genero: z.string()
    .min(1, "Debes seleccionar un género"),
  altura: z.string()
    .min(1, "La altura es requerida"),
  peso: z.string()
    .min(1, "El peso es requerido"),
  telefono: z.string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(15, "El teléfono no puede tener más de 15 dígitos"),
});

export const foodPreferencesSchema = z.object({
  tipoDieta: z.array(z.string())
    .min(1, 'Debes seleccionar al menos un tipo de dieta'),
  alergias: z.array(z.string()),
  alimentosEvitados: z.array(z.string()),
  frecuenciaComida: z.string()
    .min(1, 'Debes seleccionar una frecuencia de comidas'),
});

export const goalsObjectivesSchema = z.object({
  mainGoal: z.string()
    .min(1, "Debes seleccionar un objetivo principal"),
  timeframe: z.string()
    .min(1, "Debes seleccionar un tiempo objetivo"),
  commitmentLevel: z.number()
    .min(1, "El nivel de compromiso debe ser al menos 1")
    .max(5, "El nivel de compromiso no puede ser mayor a 5"),
  measurementPreference: z.array(z.string())
    .min(1, "Debes seleccionar al menos una preferencia de medición"),
});

export const fitnessLevelSchema = z.object({
  exerciseFrequency: z.string()
    .min(1, "Debes seleccionar la frecuencia de ejercicio"),
  exerciseType: z.array(z.string())
    .min(1, "Debes seleccionar al menos un tipo de ejercicio"),
  availableEquipment: z.array(z.string()),
  availableTime: z.string()
    .min(1, "Debes seleccionar el tiempo disponible"),
  medicalConditions: z.string(),
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

export const dailyHabitsSchema = z.object({
  sleepSchedule: z.string()
    .min(1, "Debes seleccionar tu horario de sueño"),
  stressLevel: z.string()
    .min(1, "Debes seleccionar tu nivel de estrés"),
  workSchedule: z.string()
    .min(1, "Debes seleccionar tu horario de trabajo"),
  dietaryRestrictions: z.array(z.string()),
  mealPreparationTime: z.string()
    .min(1, "Debes seleccionar el tiempo de preparación de comidas"),
  snackingHabits: z.string()
    .min(1, "Debes seleccionar tus hábitos de snacking"),
  waterIntake: z.string()
    .min(1, "Debes seleccionar tu consumo de agua"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoFormSchema>;
export type PersonalInfoContextData = z.infer<typeof personalInfoContextSchema>;
export type FoodPreferencesData = z.infer<typeof foodPreferencesSchema>;
export type GoalsObjectivesData = z.infer<typeof goalsObjectivesSchema>;
export type FitnessLevelData = z.infer<typeof fitnessLevelSchema>;
export type MedicalHistoryData = z.infer<typeof medicalHistorySchema>;
export type DailyHabitsData = z.infer<typeof dailyHabitsSchema>; 