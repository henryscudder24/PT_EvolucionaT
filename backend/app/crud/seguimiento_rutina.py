from sqlalchemy.orm import Session
from app.models.models_auto import SeguimientoRutina
from app.schemas.seguimiento_rutina import SeguimientoRutinaCreate

def crear_seguimiento(db: Session, datos: SeguimientoRutinaCreate):
    nuevo = SeguimientoRutina(**datos.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def listar_seguimientos(db: Session, id_plan_rutina: int):
    return db.query(SeguimientoRutina).filter(
        SeguimientoRutina.id_plan_rutina == id_plan_rutina
    ).order_by(SeguimientoRutina.fecha.desc()).all()
