from sqlalchemy.orm import Session
from app.models.models_auto import SeguimientoDieta
from app.schemas.seguimiento_dieta import SeguimientoDietaCreate

def crear_seguimiento(db: Session, datos: SeguimientoDietaCreate):
    nuevo = SeguimientoDieta(**datos.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def listar_seguimientos(db: Session, id_plan_dieta: int):
    return db.query(SeguimientoDieta).filter(SeguimientoDieta.id_plan_dieta == id_plan_dieta).order_by(SeguimientoDieta.fecha.desc()).all()
