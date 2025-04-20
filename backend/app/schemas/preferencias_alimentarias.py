from pydantic import BaseModel
from typing import Literal

class PreferenciaBase(BaseModel):
    id_perfil: int
    tipo: Literal['dieta', 'alergia', 'favorito']
    valor: str

class PreferenciaCreate(PreferenciaBase):
    pass

class PreferenciaOut(PreferenciaBase):
    id: int

    class Config:
        orm_mode = True