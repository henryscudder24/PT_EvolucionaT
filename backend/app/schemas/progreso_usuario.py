from pydantic import BaseModel
from datetime import date

class ProgresoUsuarioBase(BaseModel):
    id_usuario: int
    descripcion: str
    fecha: date

class ProgresoUsuarioCreate(ProgresoUsuarioBase):
    pass

class ProgresoUsuarioOut(ProgresoUsuarioBase):
    id: int

    class Config:
        orm_mode = True
