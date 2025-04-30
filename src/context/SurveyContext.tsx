import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { 
  PersonalInfoFormData,
  FoodPreferencesData,
  MedicalHistoryData,
  DailyHabitsData,
  FitnessLevelData,
  GoalsObjectivesData
} from '../validationSchemas';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Tipos para los datos de la encuesta
export interface SurveyData {
  // Sección 1: Información Personal
  personalInfo: PersonalInfoFormData;

  // Sección 2: Preferencias Alimentarias
  foodPreferences: FoodPreferencesData;

  // Sección 3: Metas y Objetivos
  goalsObjectives: GoalsObjectivesData;

  // Sección 4: Nivel de Condición Física
  fitnessLevel: FitnessLevelData;

  // Sección 5: Historial Médico
  medicalHistory: MedicalHistoryData;

  // Sección 6: Hábitos Diarios
  dailyHabits: DailyHabitsData;
}

interface SurveyContextType {
  currentStep: number;
  totalSteps: number;
  surveyData: SurveyData;
  updateSurveyData: (data: Partial<SurveyData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSurvey: () => void;
  isLastStep: boolean;
  isStepComplete: (step: number) => boolean;
  finishSurvey: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const navigate = useNavigate();

  const [surveyData, setSurveyData] = useState<SurveyData>({
    personalInfo: {
      genero: 'Masculino',
      edad: 18,
      altura: 170,
      peso: 70,
      nivelActividad: 'Moderado'
    },
    foodPreferences: {
      tipoDieta: [],
      alergias: [],
      otrosAlergias: '',
      alimentosFavoritos: [],
      alimentosEvitar: ''
    },
    goalsObjectives: {
      objetivoPrincipal: 'Mantenimiento de la salud',
      tiempoMeta: '3-6 meses',
      nivelCompromiso: 3,
      medicionProgreso: []
    },
    fitnessLevel: {
      frecuenciaEjercicio: '1-2 veces por semana',
      tiposEjercicio: [],
      equipamiento: [],
      tiempoEjercicio: '30-60 minutos'
    },
    medicalHistory: {
      condicionesCronicas: [],
      otrasCondiciones: '',
      medicamentos: '',
      lesionesRecientes: '',
      antecedentesFamiliares: ''
    },
    dailyHabits: {
      horasSueno: '7-8 horas',
      calidadSueno: 'Buena',
      nivelEstres: 'Moderado',
      consumoAgua: '1-2 litros',
      comidasPorDia: '3-4',
      habitosSnacks: '1-2 snacks al día',
      horasPantallas: '4-8 horas',
      tipoTrabajo: 'Sedentario'
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
        genero: 'Masculino',
        edad: 18,
        altura: 170,
        peso: 70,
        nivelActividad: 'Moderado'
      },
      foodPreferences: {
        tipoDieta: [],
        alergias: [],
        otrosAlergias: '',
        alimentosFavoritos: [],
        alimentosEvitar: ''
      },
      goalsObjectives: {
        objetivoPrincipal: 'Mantenimiento de la salud',
        tiempoMeta: '3-6 meses',
        nivelCompromiso: 3,
        medicionProgreso: []
      },
      fitnessLevel: {
        frecuenciaEjercicio: '1-2 veces por semana',
        tiposEjercicio: [],
        equipamiento: [],
        tiempoEjercicio: '30-60 minutos'
      },
      medicalHistory: {
        condicionesCronicas: [],
        otrasCondiciones: '',
        medicamentos: '',
        lesionesRecientes: '',
        antecedentesFamiliares: ''
      },
      dailyHabits: {
        horasSueno: '7-8 horas',
        calidadSueno: 'Buena',
        nivelEstres: 'Moderado',
        consumoAgua: '1-2 litros',
        comidasPorDia: '3-4',
        habitosSnacks: '1-2 snacks al día',
        horasPantallas: '4-8 horas',
        tipoTrabajo: 'Sedentario'
      }
    });
    toast.success('Encuesta reiniciada');
  }, []);

  const isLastStep = currentStep === totalSteps;

  const isStepComplete = useCallback((step: number): boolean => {
    switch (step) {
      case 1: // Información Personal
        return Boolean(
          surveyData.personalInfo.genero &&
          surveyData.personalInfo.edad >= 15 &&
          surveyData.personalInfo.edad <= 100 &&
          surveyData.personalInfo.altura >= 100 &&
          surveyData.personalInfo.altura <= 250 &&
          surveyData.personalInfo.peso >= 30 &&
          surveyData.personalInfo.peso <= 300 &&
          surveyData.personalInfo.nivelActividad
        );
      case 2: // Preferencias Alimentarias
        return Boolean(
          surveyData.foodPreferences.tipoDieta.length > 0 &&
          surveyData.foodPreferences.alimentosFavoritos.length > 0
        );
      case 3: // Metas y Objetivos
        return Boolean(
          surveyData.goalsObjectives.objetivoPrincipal &&
          surveyData.goalsObjectives.tiempoMeta &&
          surveyData.goalsObjectives.nivelCompromiso >= 1 &&
          surveyData.goalsObjectives.nivelCompromiso <= 5 &&
          surveyData.goalsObjectives.medicionProgreso.length > 0
        );
      case 4: // Nivel de Condición Física
        return Boolean(
          surveyData.fitnessLevel.frecuenciaEjercicio &&
          surveyData.fitnessLevel.tiposEjercicio.length > 0 &&
          surveyData.fitnessLevel.equipamiento.length > 0 &&
          surveyData.fitnessLevel.tiempoEjercicio
        );
      case 5: // Historial Médico
        return true; // Todos los campos son opcionales
      case 6: // Hábitos Diarios
        return Boolean(
          surveyData.dailyHabits.horasSueno &&
          surveyData.dailyHabits.calidadSueno &&
          surveyData.dailyHabits.nivelEstres &&
          surveyData.dailyHabits.consumoAgua &&
          surveyData.dailyHabits.comidasPorDia &&
          surveyData.dailyHabits.habitosSnacks &&
          surveyData.dailyHabits.horasPantallas &&
          surveyData.dailyHabits.tipoTrabajo
        );
      default:
        return false;
    }
  }, [surveyData]);

  const finishSurvey = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Debes iniciar sesión para completar la encuesta');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/survey/complete',
        {
          personalInfo: {
            genero: surveyData.personalInfo.genero,
            edad: surveyData.personalInfo.edad,
            altura: surveyData.personalInfo.altura,
            peso: surveyData.personalInfo.peso,
            nivelActividad: surveyData.personalInfo.nivelActividad
          },
          foodPreferences: {
            tipoDieta: surveyData.foodPreferences.tipoDieta,
            alergias: surveyData.foodPreferences.alergias,
            otrosAlergias: surveyData.foodPreferences.otrosAlergias,
            alimentosFavoritos: surveyData.foodPreferences.alimentosFavoritos,
            alimentosEvitar: surveyData.foodPreferences.alimentosEvitar
          },
          goalsObjectives: {
            objetivoPrincipal: surveyData.goalsObjectives.objetivoPrincipal,
            tiempoMeta: surveyData.goalsObjectives.tiempoMeta,
            nivelCompromiso: surveyData.goalsObjectives.nivelCompromiso,
            medicionProgreso: surveyData.goalsObjectives.medicionProgreso
          },
          fitnessLevel: {
            frecuenciaEjercicio: surveyData.fitnessLevel.frecuenciaEjercicio,
            tiposEjercicio: surveyData.fitnessLevel.tiposEjercicio,
            equipamiento: surveyData.fitnessLevel.equipamiento,
            tiempoEjercicio: surveyData.fitnessLevel.tiempoEjercicio
          },
          medicalHistory: {
            condicionesCronicas: surveyData.medicalHistory.condicionesCronicas,
            otrasCondiciones: surveyData.medicalHistory.otrasCondiciones,
            medicamentos: surveyData.medicalHistory.medicamentos,
            lesionesRecientes: surveyData.medicalHistory.lesionesRecientes,
            antecedentesFamiliares: surveyData.medicalHistory.antecedentesFamiliares
          },
          dailyHabits: {
            horasSueno: surveyData.dailyHabits.horasSueno,
            calidadSueno: surveyData.dailyHabits.calidadSueno,
            nivelEstres: surveyData.dailyHabits.nivelEstres,
            consumoAgua: surveyData.dailyHabits.consumoAgua,
            comidasPorDia: surveyData.dailyHabits.comidasPorDia,
            habitosSnacks: surveyData.dailyHabits.habitosSnacks,
            horasPantallas: surveyData.dailyHabits.horasPantallas,
            tipoTrabajo: surveyData.dailyHabits.tipoTrabajo
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        toast.success('Encuesta completada con éxito');
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Error al finalizar la encuesta:', error);
      if (error.response?.status === 422) {
        toast.error('Error en el formato de los datos. Por favor, verifica todos los campos.');
      } else {
        toast.error('Hubo un error al completar la encuesta');
      }
      throw error;
    }
  }, [surveyData, navigate]);

  return (
    <SurveyContext.Provider
      value={{
        currentStep,
        totalSteps,
        surveyData,
        updateSurveyData,
        nextStep,
        prevStep,
        resetSurvey,
        isLastStep,
        isStepComplete,
        finishSurvey
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
