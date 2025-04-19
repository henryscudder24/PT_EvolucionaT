import type React from 'react';
import { createContext, useContext, useState, type ReactNode } from 'react'

// Tipos para los datos de la encuesta
export interface SurveyData {
  // Sección 1: Información Personal Básica
  gender: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: string;

  // Sección 2: Preferencias Alimentarias
  dietType: string[];
  allergies: string[];
  favoriteFoods: string[];
  foodsToAvoid: string;

  // Sección 3: Metas y Objetivos
  mainGoal: string;
  timeframe: string;
  commitmentLevel: number;
  measurementPreference: string[];

  // Sección 4: Nivel de Condición Física y Entrenamiento
  exerciseFrequency: string;
  exerciseType: string[];
  availableEquipment: string[];
  availableTime: string;
  medicalConditions: string;

  // Sección 5: Historial Médico
  hasChronicConditions: boolean;
  chronicConditions: string[];
  takingMedication: boolean;
  medications: string;
  recentInjuries: string[];
  familyHistoryIssues: string[];

  // Sección 6: Hábitos Diarios
  sleepHours: string;
  sleepQuality: string;
  stressLevel: string;
  waterIntake: string;
  mealFrequency: string;
  snackingHabits: string;
  screenTime: string;
  workType: string;
}

// Interfaz del contexto
interface SurveyContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  surveyData: SurveyData;
  updateSurveyData: (data: Partial<SurveyData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isStepComplete: (step: number) => boolean;
  isLastStep: boolean;
  totalSteps: number;
  finishSurvey: () => void;
}

// Valores iniciales por defecto
const initialSurveyData: SurveyData = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  activityLevel: '',

  dietType: [],
  allergies: [],
  favoriteFoods: [],
  foodsToAvoid: '',

  mainGoal: '',
  timeframe: '',
  commitmentLevel: 3, // Nivel medio por defecto
  measurementPreference: [],

  exerciseFrequency: '',
  exerciseType: [],
  availableEquipment: [],
  availableTime: '',
  medicalConditions: '',

  // Nuevos campos para historial médico
  hasChronicConditions: false,
  chronicConditions: [],
  takingMedication: false,
  medications: '',
  recentInjuries: [],
  familyHistoryIssues: [],

  // Nuevos campos para hábitos diarios
  sleepHours: '',
  sleepQuality: '',
  stressLevel: '',
  waterIntake: '',
  mealFrequency: '',
  snackingHabits: '',
  screenTime: '',
  workType: '',
};

// Crear el contexto
const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey debe usarse dentro de un SurveyProvider');
  }
  return context;
};

// Proveedor del contexto
export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState<SurveyData>(initialSurveyData);
  const totalSteps = 6; // Actualizado a 6 pasos

  // Actualizar datos de la encuesta
  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData(prevData => ({ ...prevData, ...data }));
  };

  // Navegar al siguiente paso
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else if (currentStep === totalSteps) {
      // Si estamos en el último paso, llamamos a la función de finalizar encuesta
      finishSurvey();
    }
  };

  // Navegar al paso anterior
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Finalizar la encuesta
  const finishSurvey = () => {
    // Aquí podríamos enviar los datos a un servidor si fuera necesario
    console.log('Encuesta finalizada:', surveyData);

    // Avanzar al paso de finalización (más allá del último paso)
    setCurrentStep(totalSteps + 1);

    // Desplazamiento al inicio de la página
    window.scrollTo(0, 0);
  };

  // Verificar si un paso está completo
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: // Información Personal
        return !!(surveyData.gender && surveyData.age && surveyData.height && surveyData.weight && surveyData.activityLevel);
      case 2: // Preferencias Alimentarias
        return !!(surveyData.dietType.length > 0 && surveyData.favoriteFoods.length > 0);
      case 3: // Metas y Objetivos
        return !!(surveyData.mainGoal && surveyData.timeframe && surveyData.measurementPreference.length > 0);
      case 4: // Nivel de Condición Física
        return !!(surveyData.exerciseFrequency && surveyData.exerciseType.length > 0 && surveyData.availableTime);
      case 5: // Historial Médico
        // No requerimos todos los campos porque algunos pueden no aplicar
        return true;
      case 6: // Hábitos Diarios
        return !!(surveyData.sleepHours && surveyData.sleepQuality && surveyData.stressLevel);
      default:
        return false;
    }
  };

  // Verificar si es el último paso
  const isLastStep = currentStep === totalSteps;

  // Valor del contexto
  const contextValue: SurveyContextType = {
    currentStep,
    setCurrentStep,
    surveyData,
    updateSurveyData,
    goToNextStep,
    goToPreviousStep,
    isStepComplete,
    isLastStep,
    totalSteps,
    finishSurvey
  };

  return (
    <SurveyContext.Provider value={contextValue}>
      {children}
    </SurveyContext.Provider>
  );
};

export default SurveyContext;
