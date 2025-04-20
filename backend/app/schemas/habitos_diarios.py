from pydantic import BaseModel

class HabitosDiariosBase(BaseModel):
    id_perfil: int
    horas_sueno: str
    calidad_sueno: str
    nivel_estres: str
    agua_dia: str
    comidas_dia: str
    habitos_snack: str
    horas_pantalla: str
    tipo_trabajo: str

class HabitosDiariosCreate(HabitosDiariosBase):
    pass

class HabitosDiariosOut(HabitosDiariosBase):
    id: int

    class Config:
        orm_mode = True