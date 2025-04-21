from pydantic import BaseModel

class AlimentoEvitadoBase(BaseModel):
    id_perfil: int
    descripcion: str

class AlimentoEvitadoCreate(AlimentoEvitadoBase):
    pass

class AlimentoEvitadoOut(AlimentoEvitadoBase):
    id: int

    class Config:
        orm_mode = True