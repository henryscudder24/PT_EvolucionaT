from sqlalchemy.orm import Session
from app.models.models_auto import HabitosDiarios
from app.schemas.habitos_diarios import HabitosDiariosCreate

def crear_habitos(db: Session, datos: HabitosDiariosCreate):
    habitos = HabitosDiarios(**datos.dict())
    db.add(habitos)
    db.commit()
    db.refresh(habitos)
    return habitos

def obtener_habitos_por_perfil(db: Session, id_perfil: int):
    return db.query(HabitosDiarios).filter(HabitosDiarios.id_perfil == id_perfil).first()

def actualizar_habitos(db: Session, id: int, datos: HabitosDiariosCreate):
    habitos = db.query(HabitosDiarios).filter(HabitosDiarios.id == id).first()
    if habitos:
        for key, value in datos.dict().items():
            setattr(habitos, key, value)
        db.commit()
        db.refresh(habitos)
    return habitos