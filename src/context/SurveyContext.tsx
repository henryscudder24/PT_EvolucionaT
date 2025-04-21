import type React from 'react';
import { createContext, useContext, useState, type ReactNode } from 'react';

// Tipos para los datos de la encuesta
export interface SurveyData {
  // Sección 1: Perfil de Usuario
  genero: string;
  edad: string;
  altura: string;
  peso: string;
  nivelActividad: string;

  // Sección 2: Preferencias Alimentarias
  dietasSugeridas: string[];
  alergiasSugeridas: string[];
  favoritosSugeridos: string[];
  alimentosEvitar: string;

  // Sección 3: Metas y Objetivos
  objetivoPrincipal: string;
  tiempoMeta: string;
  nivelCompromiso: number;
  preferenciaMedicion: string[];

  // Sección 4: Nivel físico
  frecuenciaEjercicio: string;
  tipoEjercicio: string[];
  equipamientoDisponible: string[];
  tiempoDisponible: string;
  condicionesMedicas: string;

  // Sección 5: Historial Médico
  tieneCondicionesCronicas: boolean;
  condicionesCronicas: string[];
  tomaMedicacion: boolean;
  medicamentos: string;
  lesionesRecientes: string[];
  antecedentesFamiliares: string[];

  // Sección 6: Hábitos Diarios
  horasSueño: string;
  calidadSueño: string;
  nivelEstres: string;
  consumoAgua: string;
  frecuenciaComidas: string;
  habitosSnacks: string;
  tiempoPantalla: string;
  tipoTrabajo: string;
}

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

// Datos iniciales
const initialSurveyData: SurveyData = {
  genero: '',
  edad: '',
  altura: '',
  peso: '',
  nivelActividad: '',

  dietasSugeridas: [],
  alergiasSugeridas: [],
  favoritosSugeridos: [],
  alimentosEvitar: '',

  objetivoPrincipal: '',
  tiempoMeta: '',
  nivelCompromiso: 3,
  preferenciaMedicion: [],

  frecuenciaEjercicio: '',
  tipoEjercicio: [],
  equipamientoDisponible: [],
  tiempoDisponible: '',
  condicionesMedicas: '',

  tieneCondicionesCronicas: false,
  condicionesCronicas: [],
  tomaMedicacion: false,
  medicamentos: '',
  lesionesRecientes: [],
  antecedentesFamiliares: [],

  horasSueño: '',
  calidadSueño: '',
  nivelEstres: '',
  consumoAgua: '',
  frecuenciaComidas: '',
  habitosSnacks: '',
  tiempoPantalla: '',
  tipoTrabajo: '',
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey debe usarse dentro de un SurveyProvider');
  }
  return context;
};

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState<SurveyData>(initialSurveyData);
  const totalSteps = 6;

  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      finishSurvey();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const finishSurvey = () => {
    console.log('Encuesta finalizada:', surveyData);
    setCurrentStep(totalSteps + 1);
    window.scrollTo(0, 0);
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(surveyData.genero && surveyData.edad && surveyData.altura && surveyData.peso && surveyData.nivelActividad);
      case 2:
        return !!(surveyData.dietasSugeridas.length && surveyData.favoritosSugeridos.length);
      case 3:
        return !!(surveyData.objetivoPrincipal && surveyData.tiempoMeta && surveyData.preferenciaMedicion.length);
      case 4:
        return !!(surveyData.frecuenciaEjercicio && surveyData.tipoEjercicio.length && surveyData.tiempoDisponible);
      case 5:
        return true;
      case 6:
        return !!(surveyData.horasSueño && surveyData.calidadSueño && surveyData.nivelEstres);
      default:
        return false;
    }
  };

  const isLastStep = currentStep === totalSteps;

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
    finishSurvey,
  };

  return (
    <SurveyContext.Provider value={contextValue}>
      {children}
    </SurveyContext.Provider>
  );
};

export default SurveyContext;
