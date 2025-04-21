from pydantic import BaseModel

class PlanDietaBase(BaseModel):
    id_usuario: int
    id_estado_plan: int

class PlanDietaCreate(PlanDietaBase):
    pass

class PlanDietaOut(PlanDietaBase):
    id: int

    class Config:
        orm_mode = True