export interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export interface SurveyData {
  medicalHistory?: MedicalHistoryData;
  // Add other survey data types as needed
}

export interface MedicalHistoryData {
  hasChronicConditions: boolean;
  chronicConditions: string[];
  takingMedication: boolean;
  medications: string;
  recentInjuries: string[];
  familyHistoryIssues: string[];
  allergies: string[];
  additionalNotes: string;
} 