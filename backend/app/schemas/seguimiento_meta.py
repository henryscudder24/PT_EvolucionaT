from pydantic import BaseModel
from datetime import date

class SeguimientoMetaBase(BaseModel):
    id_meta_usuario: int
    fecha: date
    avance: str

class SeguimientoMetaCreate(SeguimientoMetaBase):
    pass

class SeguimientoMetaOut(SeguimientoMetaBase):
    id: int

    class Config:
        orm_mode = True