from sqlalchemy.orm import Session
from app.models.models_auto import PlanDietaUsuario
from app.schemas.plan_dieta_usuario import PlanDietaCreate

def crear_plan_dieta(db: Session, datos: PlanDietaCreate):
    nuevo = PlanDietaUsuario(**datos.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def obtener_plan_usuario(db: Session, id_usuario: int):
    return db.query(PlanDietaUsuario).filter(PlanDietaUsuario.id_usuario == id_usuario).first()

def actualizar_plan(db: Session, id: int, datos: PlanDietaCreate):
    plan = db.query(PlanDietaUsuario).filter(PlanDietaUsuario.id == id).first()
    if plan:
        for key, value in datos.dict().items():
            setattr(plan, key, value)
        db.commit()
        db.refresh(plan)
    return plan
