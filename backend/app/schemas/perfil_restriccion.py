from pydantic import BaseModel

class PerfilRestriccionBase(BaseModel):
    id_perfil: int
    id_restriccion: int

class PerfilRestriccionCreate(PerfilRestriccionBase):
    pass

class PerfilRestriccionOut(PerfilRestriccionBase):
    id: int

    class Config:
        orm_mode = True