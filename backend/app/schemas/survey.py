from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class PersonalInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    genero: str
    edad: int
    peso: float
    altura: float
    nivelActividad: str

class FoodPreferences(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    tipoDieta: List[str]
    alergias: List[str]
    otrosAlergias: Optional[str] = None
    alimentosFavoritos: List[str]
    otrosAlimentosFavoritos: Optional[str] = None
    alimentosEvitados: List[str]

class GoalsObjectives(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    objetivoPrincipal: Optional[str]
    tiempoMeta: Optional[str]
    nivelCompromiso: Optional[int]
    medicionProgreso: Optional[str]

class PhysicalCondition(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    frecuenciaEjercicio: Optional[str]
    tiempoDisponible: Optional[str]
    ejerciciosPreferidos: List[str]
    equipamientoDisponible: List[str]

class MedicalHistory(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    condicionCronica: Optional[str]
    otrasCondiciones: Optional[str] = None
    medicamentos: Optional[str] = None
    lesiones: Optional[str] = None
    antecedentesFamiliares: Optional[str] = None

class DailyHabits(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    horasSueno: Optional[str]
    calidadSueno: Optional[str]
    nivelEstres: Optional[str]
    aguaDia: Optional[str]
    comidasDia: Optional[str]
    habitosSnack: Optional[str]
    horasPantalla: Optional[str]
    tipoTrabajo: Optional[str]

class SurveyDataResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    personalInfo: PersonalInfo
    goalsObjectives: GoalsObjectives
    foodPreferences: FoodPreferences
    physicalCondition: PhysicalCondition
    medicalHistory: MedicalHistory
    dailyHabits: DailyHabits 