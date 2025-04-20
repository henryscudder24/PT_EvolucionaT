from pydantic import BaseModel
from typing import Optional

class PerfilUsuarioBase(BaseModel):
    genero: str
    edad: int
    peso: float
    altura: float
    nivel_actividad: str
    objetivo_principal: Optional[str]
    tiempo_meta: Optional[str]
    nivel_compromiso: Optional[int]
    id_usuario: int

class PerfilUsuarioCreate(PerfilUsuarioBase):
    pass

class PerfilUsuarioOut(PerfilUsuarioBase):
    id: int

    class Config:
        orm_mode = True