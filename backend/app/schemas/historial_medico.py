from pydantic import BaseModel

class HistorialMedicoBase(BaseModel):
    id_perfil: int
    condicion_cronica: str
    medicamentos: str
    lesiones: str
    antecedentes_familiares: str

class HistorialMedicoCreate(HistorialMedicoBase):
    pass

class HistorialMedicoOut(HistorialMedicoBase):
    id: int

    class Config:
        orm_mode = True