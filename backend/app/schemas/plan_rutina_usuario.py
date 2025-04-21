from pydantic import BaseModel

class PlanRutinaBase(BaseModel):
    id_usuario: int
    id_estado_plan: int

class PlanRutinaCreate(PlanRutinaBase):
    pass

class PlanRutinaOut(PlanRutinaBase):
    id: int

    class Config:
        orm_mode = True
