from sqlalchemy.orm import Session
from app.models.models_auto import PlanRutinaUsuario
from app.schemas.plan_rutina_usuario import PlanRutinaCreate

def crear_plan_rutina(db: Session, datos: PlanRutinaCreate):
    nuevo = PlanRutinaUsuario(**datos.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def obtener_plan_por_usuario(db: Session, id_usuario: int):
    return db.query(PlanRutinaUsuario).filter(PlanRutinaUsuario.id_usuario == id_usuario).first()

def actualizar_plan_rutina(db: Session, id: int, datos: PlanRutinaCreate):
    plan = db.query(PlanRutinaUsuario).filter(PlanRutinaUsuario.id == id).first()
    if plan:
        for key, value in datos.dict().items():
            setattr(plan, key, value)
        db.commit()
        db.refresh(plan)
    return plan
