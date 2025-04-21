from pydantic import BaseModel
from datetime import date

class SeguimientoDietaBase(BaseModel):
    id_plan_dieta: int
    fecha: date
    descripcion: str

class SeguimientoDietaCreate(SeguimientoDietaBase):
    pass

class SeguimientoDietaOut(SeguimientoDietaBase):
    id: int

    class Config:
        orm_mode = True
