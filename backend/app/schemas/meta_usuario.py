from pydantic import BaseModel
from typing import Optional

class MetaUsuarioBase(BaseModel):
    id_usuario: int
    id_tipo_objetivo: int

class MetaUsuarioCreate(MetaUsuarioBase):
    pass

class MetaUsuarioOut(MetaUsuarioBase):
    id: int

    class Config:
        orm_mode = True