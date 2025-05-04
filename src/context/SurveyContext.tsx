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
  finishSurvey: () => Promise<boolean>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
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
      objetivoPrincipal: ['Mantenimiento de la salud'],
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
        objetivoPrincipal: ['Mantenimiento de la salud'],
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
    localStorage.removeItem('surveyData');
  }, []);

  const isLastStep = currentStep === totalSteps;

  const isStepComplete = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          surveyData.personalInfo.genero &&
          surveyData.personalInfo.edad &&
          surveyData.personalInfo.edad > 0 &&
          surveyData.personalInfo.altura &&
          surveyData.personalInfo.altura > 0 &&
          surveyData.personalInfo.peso &&
          surveyData.personalInfo.peso > 0 &&
          surveyData.personalInfo.nivelActividad
        );
      case 2:
        return !!(
          surveyData.foodPreferences.tipoDieta.length > 0 &&
          surveyData.foodPreferences.alimentosFavoritos.length > 0 &&
          // Si hay "Otro" en alergias, debe tener texto en otrosAlergias
          (!surveyData.foodPreferences.alergias.includes('Otro') || 
           (surveyData.foodPreferences.alergias.includes('Otro') && 
            surveyData.foodPreferences.otrosAlergias?.trim() !== ''))
        );
      case 3:
        return !!(
          surveyData.goalsObjectives.objetivoPrincipal.length > 0 &&
          surveyData.goalsObjectives.tiempoMeta &&
          surveyData.goalsObjectives.nivelCompromiso &&
          surveyData.goalsObjectives.nivelCompromiso > 0 &&
          surveyData.goalsObjectives.medicionProgreso.length > 0
        );
      case 4:
        return !!(
          surveyData.fitnessLevel.frecuenciaEjercicio &&
          surveyData.fitnessLevel.tiposEjercicio.length > 0 &&
          surveyData.fitnessLevel.equipamiento.length > 0 &&
          surveyData.fitnessLevel.tiempoEjercicio
        );
      case 5:
        return true; // El historial médico es opcional
      case 6:
        return !!(
          surveyData.dailyHabits.horasSueno &&
          surveyData.dailyHabits.calidadSueno &&
          surveyData.dailyHabits.nivelEstres &&
          surveyData.dailyHabits.consumoAgua &&
          surveyData.dailyHabits.comidasPorDia &&
          surveyData.dailyHabits.habitosSnacks &&
          surveyData.dailyHabits.horasPantallas &&
          surveyData.dailyHabits.tipoTrabajo
        );
      case 7:
        return true; // La pantalla de finalización siempre está completa
      default:
        return false;
    }
  }, [surveyData]);

  const finishSurvey = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Debes iniciar sesión para completar la encuesta');
        navigate('/login');
        return false;
      }

      // Transformar los datos al formato exacto esperado por el backend
      const transformedData = {
        personalInfo: {
          edad: surveyData.personalInfo.edad,
          genero: surveyData.personalInfo.genero.toLowerCase(),
          altura: surveyData.personalInfo.altura,
          peso: surveyData.personalInfo.peso,
          nivelActividad: surveyData.personalInfo.nivelActividad.toLowerCase()
        },
        foodPreferences: {
          tipoDieta: Array.isArray(surveyData.foodPreferences.tipoDieta) 
            ? surveyData.foodPreferences.tipoDieta 
            : [surveyData.foodPreferences.tipoDieta],
          alergias: Array.isArray(surveyData.foodPreferences.alergias)
            ? surveyData.foodPreferences.alergias
            : [surveyData.foodPreferences.alergias],
          otrosAlergias: surveyData.foodPreferences.otrosAlergias || '',
          alimentosFavoritos: Array.isArray(surveyData.foodPreferences.alimentosFavoritos)
            ? surveyData.foodPreferences.alimentosFavoritos
            : [surveyData.foodPreferences.alimentosFavoritos],
          alimentosEvitados: surveyData.foodPreferences.alimentosEvitar 
            ? [surveyData.foodPreferences.alimentosEvitar]
            : []
        },
        goalsObjectives: {
          objetivoPrincipal: Array.isArray(surveyData.goalsObjectives.objetivoPrincipal)
            ? surveyData.goalsObjectives.objetivoPrincipal[0]
            : surveyData.goalsObjectives.objetivoPrincipal,
          tiempoMeta: surveyData.goalsObjectives.tiempoMeta,
          nivelCompromiso: surveyData.goalsObjectives.nivelCompromiso,
          medicionProgreso: Array.isArray(surveyData.goalsObjectives.medicionProgreso)
            ? surveyData.goalsObjectives.medicionProgreso[0]
            : surveyData.goalsObjectives.medicionProgreso
        },
        physicalCondition: {
          frecuenciaEjercicio: surveyData.fitnessLevel.frecuenciaEjercicio,
          tiempoDisponible: surveyData.fitnessLevel.tiempoEjercicio,
          ejerciciosPreferidos: Array.isArray(surveyData.fitnessLevel.tiposEjercicio)
            ? surveyData.fitnessLevel.tiposEjercicio
            : [surveyData.fitnessLevel.tiposEjercicio],
          equipamientoDisponible: Array.isArray(surveyData.fitnessLevel.equipamiento)
            ? surveyData.fitnessLevel.equipamiento
            : [surveyData.fitnessLevel.equipamiento]
        },
        medicalHistory: {
          condicionCronica: Array.isArray(surveyData.medicalHistory.condicionesCronicas)
            ? surveyData.medicalHistory.condicionesCronicas.join(', ')
            : surveyData.medicalHistory.condicionesCronicas || 'Ninguna',
          otrasCondiciones: surveyData.medicalHistory.otrasCondiciones || '',
          medicamentos: surveyData.medicalHistory.medicamentos || '',
          lesiones: surveyData.medicalHistory.lesionesRecientes || '',
          antecedentesFamiliares: surveyData.medicalHistory.antecedentesFamiliares || ''
        },
        dailyHabits: {
          horasSueno: surveyData.dailyHabits.horasSueno,
          calidadSueno: surveyData.dailyHabits.calidadSueno,
          nivelEstres: surveyData.dailyHabits.nivelEstres,
          aguaDia: surveyData.dailyHabits.consumoAgua,
          comidasDia: surveyData.dailyHabits.comidasPorDia,
          habitosSnack: surveyData.dailyHabits.habitosSnacks,
          horasPantalla: surveyData.dailyHabits.horasPantallas,
          tipoTrabajo: surveyData.dailyHabits.tipoTrabajo
        }
      };

      console.log('Datos a enviar:', JSON.stringify(transformedData, null, 2)); // Para debugging

      const response = await axios.post(
        'http://localhost:8000/api/survey/complete',
        transformedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('¡Encuesta completada con éxito!');
        // Reseteamos la encuesta después de completarla exitosamente
        resetSurvey();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al completar la encuesta:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalles del error:', error.response.data);
        const errorMessage = typeof error.response.data === 'object' 
          ? JSON.stringify(error.response.data)
          : error.response.data.detail || 'Hubo un error al completar la encuesta';
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.error('Hubo un error al completar la encuesta. Por favor, intenta nuevamente.');
      }
      return false;
    }
  }, [surveyData, navigate, resetSurvey]);

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
