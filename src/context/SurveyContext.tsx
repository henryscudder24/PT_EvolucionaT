import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { 
  PersonalInfoContextData, 
  FoodPreferencesData,
  GoalsObjectivesData,
  DailyHabitsData,
  MedicalHistoryData,
  FitnessLevelData
} from '../validationSchemas';

// Tipos para los datos de la encuesta
export interface SurveyData {
  // Sección 1: Perfil de Usuario
  personalInfo: PersonalInfoContextData;

  // Sección 2: Preferencias Alimentarias
  foodPreferences: FoodPreferencesData;

  // Sección 3: Metas y Objetivos
  goalsObjectives: GoalsObjectivesData;

  // Sección 4: Nivel físico
  fitnessLevel: FitnessLevelData;

  // Sección 5: Historial Médico
  medicalHistory: MedicalHistoryData;

  // Sección 6: Hábitos Diarios
  dailyHabits: DailyHabitsData;
}

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface SurveyContextType {
  currentStep: number;
  totalSteps: number;
  currentQuestion: Question | null;
  surveyData: SurveyData;
  updateSurveyData: (data: Partial<SurveyData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLastStep: boolean;
  resetSurvey: () => void;
  isStepComplete: (step: number) => boolean;
  finishSurvey: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const questions: Question[] = [
  {
    id: 1,
    text: '¿Cuál es tu nivel de experiencia en el sector energético?',
    options: ['Principiante', 'Intermedio', 'Avanzado', 'Experto']
  },
  {
    id: 2,
    text: '¿Qué tipo de proyectos te interesan más?',
    options: ['Residencial', 'Comercial', 'Industrial', 'Todos los anteriores']
  },
  {
    id: 3,
    text: '¿Cuál es tu principal objetivo?',
    options: ['Ahorro energético', 'Sostenibilidad', 'Independencia energética', 'Todos los anteriores']
  },
  {
    id: 4,
    text: '¿Prefieres formación presencial u online?',
    options: ['Presencial', 'Online', 'Mixta', 'Indiferente']
  },
  {
    id: 5,
    text: '¿Cuál es tu presupuesto aproximado?',
    options: ['Menos de 10.000€', '10.000€ - 50.000€', '50.000€ - 100.000€', 'Más de 100.000€']
  }
];

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = questions.length;
  const currentQuestion = questions.find(q => q.id === currentStep) || null;
  const [surveyData, setSurveyData] = useState<SurveyData>({
    personalInfo: {
      nombre: '',
      genero: '',
      edad: '',
      altura: '',
      peso: '',
      telefono: ''
    },
    foodPreferences: {
      tipoDieta: [],
      alergias: [],
      alimentosEvitados: [],
      frecuenciaComida: '',
    },
    goalsObjectives: {
      mainGoal: '',
      timeframe: '',
      commitmentLevel: 3,
      measurementPreference: [],
    },
    fitnessLevel: {
      exerciseFrequency: '',
      exerciseType: [],
      availableEquipment: [],
      availableTime: '',
      medicalConditions: '',
    },
    medicalHistory: {
      hasChronicConditions: false,
      chronicConditions: [],
      takingMedication: false,
      medications: '',
      recentInjuries: [],
      familyHistoryIssues: [],
      allergies: [],
      additionalNotes: '',
    },
    dailyHabits: {
      sleepSchedule: '',
      stressLevel: '',
      workSchedule: '',
      dietaryRestrictions: [],
      mealPreparationTime: '',
      snackingHabits: '',
      waterIntake: ''
    }
  });

  const updateSurveyData = useCallback((data: Partial<SurveyData>) => {
    setSurveyData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      toast.success(`Paso ${currentStep} completado`);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const resetSurvey = useCallback(() => {
    setCurrentStep(1);
    setSurveyData({
      personalInfo: {
        nombre: '',
        genero: '',
        edad: '',
        altura: '',
        peso: '',
        telefono: ''
      },
      foodPreferences: {
        tipoDieta: [],
        alergias: [],
        alimentosEvitados: [],
        frecuenciaComida: '',
      },
      goalsObjectives: {
        mainGoal: '',
        timeframe: '',
        commitmentLevel: 3,
        measurementPreference: [],
      },
      fitnessLevel: {
        exerciseFrequency: '',
        exerciseType: [],
        availableEquipment: [],
        availableTime: '',
        medicalConditions: '',
      },
      medicalHistory: {
        hasChronicConditions: false,
        chronicConditions: [],
        takingMedication: false,
        medications: '',
        recentInjuries: [],
        familyHistoryIssues: [],
        allergies: [],
        additionalNotes: '',
      },
      dailyHabits: {
        sleepSchedule: '',
        stressLevel: '',
        workSchedule: '',
        dietaryRestrictions: [],
        mealPreparationTime: '',
        snackingHabits: '',
        waterIntake: ''
      }
    });
    toast.success('Encuesta reiniciada');
  }, []);

  const isLastStep = currentStep === totalSteps;

  const isStepComplete = useCallback((step: number): boolean => {
    switch (step) {
      case 1: // Personal Info
        return Boolean(
          surveyData.personalInfo.nombre &&
          surveyData.personalInfo.genero &&
          surveyData.personalInfo.edad &&
          surveyData.personalInfo.altura &&
          surveyData.personalInfo.peso &&
          surveyData.personalInfo.telefono
        );
      case 2: // Food Preferences
        return Boolean(surveyData.foodPreferences?.tipoDieta?.length && surveyData.foodPreferences?.frecuenciaComida);
      case 3: // Goals & Objectives
        return Boolean(surveyData.goalsObjectives?.mainGoal && surveyData.goalsObjectives?.timeframe);
      case 4: // Fitness Level
        return Boolean(
          surveyData.fitnessLevel?.exerciseFrequency &&
          surveyData.fitnessLevel?.exerciseType?.length &&
          surveyData.fitnessLevel?.availableTime
        );
      case 5: // Medical History
        return Boolean(surveyData.medicalHistory?.hasChronicConditions !== undefined);
      case 6: // Daily Habits
        return Boolean(
          surveyData.dailyHabits.sleepSchedule &&
          surveyData.dailyHabits.stressLevel &&
          surveyData.dailyHabits.workSchedule &&
          surveyData.dailyHabits.mealPreparationTime &&
          surveyData.dailyHabits.snackingHabits &&
          surveyData.dailyHabits.waterIntake
        );
      default:
        return false;
    }
  }, [surveyData]);

  const finishSurvey = useCallback(() => {
    // Aquí puedes agregar la lógica para finalizar la encuesta
    toast.success('¡Encuesta completada!');
  }, []);

  const nextQuestion = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <SurveyContext.Provider
      value={{
        currentStep,
        totalSteps,
        currentQuestion,
        surveyData,
        updateSurveyData,
        nextStep,
        prevStep,
        isLastStep,
        resetSurvey,
        isStepComplete,
        finishSurvey,
        nextQuestion,
        previousQuestion
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

export default SurveyContext;
