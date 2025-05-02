from pydantic import BaseModel
from typing import Literal, Optional

class PreferenciasAlimentariasBase(BaseModel):
    tipo: str
    valor: str
    otros_alergias: Optional[str] = None
    otros_alimentos_favoritos: Optional[str] = None
    id_perfil: int

class PreferenciasAlimentariasCreate(PreferenciasAlimentariasBase):
    pass

class PreferenciasAlimentariasOut(PreferenciasAlimentariasBase):
    id: int

    class Config:
        orm_mode = True