from sqlalchemy.orm import Session
from app.models.models_auto import EjercicioPreferido
from app.schemas.ejercicio_preferido import EjercicioPreferidoCreate

def crear_ejercicio(db: Session, datos: EjercicioPreferidoCreate):
    ejercicio = EjercicioPreferido(**datos.dict())
    db.add(ejercicio)
    db.commit()
    db.refresh(ejercicio)
    return ejercicio

def listar_por_perfil(db: Session, id_perfil: int):
    return db.query(EjercicioPreferido).filter(EjercicioPreferido.id_perfil == id_perfil).all()

def eliminar_ejercicio(db: Session, id: int):
    ejercicio = db.query(EjercicioPreferido).filter(EjercicioPreferido.id == id).first()
    if ejercicio:
        db.delete(ejercicio)
        db.commit()
    return ejercicio