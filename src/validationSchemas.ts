import { z } from 'zod';

// Schema for personal information
export const personalInfoFormSchema = z.object({
  genero: z.enum(['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'], {
    required_error: 'El género es requerido'
  }),
  edad: z.number()
    .min(15, 'La edad debe ser al menos 15 años')
    .max(100, 'La edad no puede ser mayor a 100 años'),
  altura: z.number()
    .min(100, 'La altura debe ser al menos 100 cm')
    .max(250, 'La altura no puede ser mayor a 250 cm'),
  peso: z.number()
    .min(30, 'El peso debe ser al menos 30 kg')
    .max(300, 'El peso no puede ser mayor a 300 kg'),
  nivelActividad: z.enum([
    'Sedentario',
    'Moderado',
    'Activo',
    'Muy activo',
    'Extremadamente activo'
  ], {
    required_error: 'El nivel de actividad es requerido'
  })
});

// Schema for food preferences
export const foodPreferencesFormSchema = z.object({
  tipoDieta: z.array(z.enum([
    'Omnívora',
    'Vegetariana',
    'Vegana',
    'Pescetariana',
    'Paleo',
    'Cetogénica',
    'Sin gluten',
    'Sin lactosa'
  ])).min(1, 'Selecciona al menos un tipo de dieta'),
  alergias: z.array(z.enum([
    'Ninguna',
    'Frutos secos',
    'Lácteos',
    'Mariscos',
    'Huevos',
    'Gluten',
    'Soja',
    'Otro'
  ])),
  otrosAlergias: z.string().optional(),
  alimentosFavoritos: z.array(z.enum([
    'Carnes',
    'Pollo',
    'Pescados',
    'Verduras',
    'Frutas',
    'Pastas',
    'Arroz',
    'Legumbres',
    'Lácteos',
    'Snacks saludables',
    'Otros'
  ])).min(1, 'Selecciona al menos un alimento favorito'),
  otrosAlimentosFavoritos: z.string().optional(),
  alimentosEvitar: z.string().optional()
});

// Schema for goals and objectives
export const goalsObjectivesSchema = z.object({
  objetivoPrincipal: z.array(z.enum([
    'Pérdida de peso',
    'Ganancia de masa muscular',
    'Mejora de la resistencia',
    'Mejora de la flexibilidad',
    'Mantenimiento de la salud',
    'Rendimiento deportivo'
  ])).min(1, 'Selecciona al menos un objetivo principal'),
  tiempoMeta: z.enum([
    '1-3 meses',
    '3-6 meses',
    '6-12 meses',
    'Más de 12 meses'
  ], {
    required_error: 'El tiempo para alcanzar la meta es requerido'
  }),
  nivelCompromiso: z.number()
    .min(1, 'El nivel de compromiso debe ser al menos 1')
    .max(5, 'El nivel de compromiso no puede ser mayor a 5'),
  medicionProgreso: z.array(z.enum([
    'Peso corporal',
    'Medidas corporales',
    'Tasa metabólica basal (TMB)',
    'IMC (Índice de Masa Corporal)',
    'Relación cintura-cadera (WHR)',
    '1RM y cargas máximas',
    'Frecuencia cardíaca en reposo',
    'Calidad del sueño'
  ])).min(1, 'Selecciona al menos una forma de medir el progreso')
});

// Schema for fitness level
export const fitnessLevelSchema = z.object({
  frecuenciaEjercicio: z.enum([
    'Nunca',
    '1-2 veces por semana',
    '3-4 veces por semana',
    '5+ veces por semana'
  ], {
    required_error: 'La frecuencia de ejercicio es requerida'
  }),
  tiposEjercicio: z.array(z.enum([
    'Cardio',
    'Pesas',
    'Yoga/Pilates',
    'Deportes de equipo',
    'Natación',
    'Ciclismo',
    'Artes marciales'
  ])).min(1, 'Selecciona al menos un tipo de ejercicio'),
  equipamiento: z.array(z.enum([
    'Pesas libres',
    'Máquinas de gimnasio',
    'Bandas elásticas',
    'Bicicleta',
    'Ninguno'
  ])).min(1, 'Selecciona el equipamiento disponible'),
  tiempoEjercicio: z.enum([
    'Menos de 30 minutos',
    '30-60 minutos',
    'Más de 60 minutos'
  ], {
    required_error: 'El tiempo disponible para ejercicio es requerido'
  })
});

// Schema for medical history
export const medicalHistorySchema = z.object({
  condicionesCronicas: z.array(z.enum([
    'Ninguna',
    'Diabetes',
    'Hipertensión',
    'Problemas cardíacos',
    'Asma',
    'Artritis',
    'Otro'
  ])),
  otrasCondiciones: z.string().optional(),
  medicamentos: z.string().optional(),
  lesionesRecientes: z.string().optional(),
  antecedentesFamiliares: z.string().optional()
});

// Schema for daily habits
export const dailyHabitsSchema = z.object({
  horasSueno: z.enum([
    'Menos de 6 horas',
    '6-7 horas',
    '7-8 horas',
    'Más de 8 horas'
  ], {
    required_error: 'Las horas de sueño son requeridas'
  }),
  calidadSueno: z.enum([
    'Excelente',
    'Buena',
    'Regular',
    'Mala'
  ], {
    required_error: 'La calidad del sueño es requerida'
  }),
  nivelEstres: z.enum([
    'Bajo',
    'Moderado',
    'Alto',
    'Muy alto'
  ], {
    required_error: 'El nivel de estrés es requerido'
  }),
  consumoAgua: z.enum([
    'Menos de 1 litro',
    '1-2 litros',
    '2-3 litros',
    'Más de 3 litros'
  ], {
    required_error: 'El consumo de agua es requerido'
  }),
  comidasPorDia: z.enum([
    '2 o menos',
    '3-4',
    '5 o más'
  ], {
    required_error: 'El número de comidas por día es requerido'
  }),
  habitosSnacks: z.enum([
    'No como snacks',
    '1-2 snacks al día',
    '3 o más snacks al día'
  ], {
    required_error: 'Los hábitos de snacks son requeridos'
  }),
  horasPantallas: z.enum([
    'Menos de 4 horas',
    '4-8 horas',
    'Más de 8 horas'
  ], {
    required_error: 'Las horas frente a pantallas son requeridas'
  }),
  tipoTrabajo: z.enum([
    'Sedentario',
    'Activo',
    'Mixto',
    'Trabajo físico intenso'
  ], {
    required_error: 'El tipo de trabajo es requerido'
  })
});

export type PersonalInfoFormData = z.infer<typeof personalInfoFormSchema>;
export type FoodPreferencesData = z.infer<typeof foodPreferencesFormSchema>;
export type GoalsObjectivesData = z.infer<typeof goalsObjectivesSchema>;
export type FitnessLevelData = z.infer<typeof fitnessLevelSchema>;
export type MedicalHistoryData = z.infer<typeof medicalHistorySchema>;
export type DailyHabitsData = z.infer<typeof dailyHabitsSchema>; 