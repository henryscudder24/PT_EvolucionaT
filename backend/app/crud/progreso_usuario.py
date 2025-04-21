from sqlalchemy.orm import Session
from app.models.models_auto import ProgresoUsuario
from app.schemas.progreso_usuario import ProgresoUsuarioCreate

def crear_progreso(db: Session, datos: ProgresoUsuarioCreate):
    nuevo = ProgresoUsuario(**datos.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def listar_progreso_usuario(db: Session, id_usuario: int):
    return db.query(ProgresoUsuario).filter(ProgresoUsuario.id_usuario == id_usuario).order_by(ProgresoUsuario.fecha.desc()).all()

def eliminar_progreso(db: Session, id: int):
    prog = db.query(ProgresoUsuario).filter(ProgresoUsuario.id == id).first()
    if prog:
        db.delete(prog)
        db.commit()
    return prog
