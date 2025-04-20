from sqlalchemy.orm import Session
from app.models.models_auto import PerfilUsuario
from app.schemas.perfil_usuario import PerfilUsuarioCreate

def crear_perfil(db: Session, datos: PerfilUsuarioCreate):
    perfil = PerfilUsuario(**datos.dict())
    db.add(perfil)
    db.commit()
    db.refresh(perfil)
    return perfil

def obtener_perfil_por_usuario(db: Session, id_usuario: int):
    return db.query(PerfilUsuario).filter(PerfilUsuario.id_usuario == id_usuario).first()

def actualizar_perfil(db: Session, id_perfil: int, datos: PerfilUsuarioCreate):
    perfil = db.query(PerfilUsuario).filter(PerfilUsuario.id == id_perfil).first()
    if perfil:
        for key, value in datos.dict().items():
            setattr(perfil, key, value)
        db.commit()
        db.refresh(perfil)
    return perfil