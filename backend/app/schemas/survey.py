from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class PersonalInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    genero: str
    edad: int
    altura: int
    peso: int
    nivelActividad: str

class FoodPreferences(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    tipoDieta: List[str]
    alergias: List[str]
    otrosAlergias: Optional[str] = None
    alimentosFavoritos: List[str]
    alimentosEvitar: Optional[str] = None

class GoalsObjectives(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    objetivoPrincipal: str
    tiempoMeta: str
    nivelCompromiso: int
    medicionProgreso: List[str]

class FitnessLevel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    frecuenciaEjercicio: str
    tiposEjercicio: List[str]
    equipamiento: List[str]
    tiempoEjercicio: str

class MedicalHistory(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    condicionesCronicas: List[str]
    otrasCondiciones: Optional[str] = None
    medicamentos: Optional[str] = None
    lesionesRecientes: Optional[str] = None
    antecedentesFamiliares: Optional[str] = None

class DailyHabits(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    horasSueno: str
    calidadSueno: str
    nivelEstres: str
    consumoAgua: str
    comidasPorDia: str
    habitosSnacks: str
    horasPantallas: str
    tipoTrabajo: str

class SurveyData(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    personalInfo: PersonalInfo
    foodPreferences: FoodPreferences
    goalsObjectives: GoalsObjectives
    fitnessLevel: FitnessLevel
    medicalHistory: MedicalHistory
    dailyHabits: DailyHabits 