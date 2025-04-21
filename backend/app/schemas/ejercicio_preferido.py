from pydantic import BaseModel

class EjercicioPreferidoBase(BaseModel):
    id_perfil: int
    tipo: str

class EjercicioPreferidoCreate(EjercicioPreferidoBase):
    pass

class EjercicioPreferidoOut(EjercicioPreferidoBase):
    id: int

    class Config:
        orm_mode = True