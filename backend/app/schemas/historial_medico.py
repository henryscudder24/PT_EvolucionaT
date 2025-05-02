from pydantic import BaseModel
from typing import Optional

class HistorialMedicoBase(BaseModel):
    condicion_cronica: Optional[str] = None
    medicamentos: Optional[str] = None
    lesiones: Optional[str] = None
    antecedentes_familiares: Optional[str] = None
    otras_condiciones: Optional[str] = None
    id_perfil: int

class HistorialMedicoCreate(HistorialMedicoBase):
    pass

class HistorialMedicoOut(HistorialMedicoBase):
    id: int

    class Config:
        orm_mode = True