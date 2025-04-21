from pydantic import BaseModel
from datetime import date

class SeguimientoRutinaBase(BaseModel):
    id_plan_rutina: int
    fecha: date
    comentarios: str

class SeguimientoRutinaCreate(SeguimientoRutinaBase):
    pass

class SeguimientoRutinaOut(SeguimientoRutinaBase):
    id: int

    class Config:
        orm_mode = True
