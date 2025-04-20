from sqlalchemy.orm import Session
from app.models.models_auto import SeguimientoMeta
from app.schemas.seguimiento_meta import SeguimientoMetaCreate

def crear_seguimiento(db: Session, datos: SeguimientoMetaCreate):
    nuevo = SeguimientoMeta(**datos.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def listar_seguimientos(db: Session, id_meta_usuario: int):
    return db.query(SeguimientoMeta).filter(SeguimientoMeta.id_meta_usuario == id_meta_usuario).all()