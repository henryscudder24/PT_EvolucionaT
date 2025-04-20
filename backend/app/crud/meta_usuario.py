from sqlalchemy.orm import Session
from app.models.models_auto import MetaUsuario
from app.schemas.meta_usuario import MetaUsuarioCreate

def crear_meta(db: Session, datos: MetaUsuarioCreate):
    meta = MetaUsuario(**datos.dict())
    db.add(meta)
    db.commit()
    db.refresh(meta)
    return meta

def obtener_metas_por_usuario(db: Session, id_usuario: int):
    return db.query(MetaUsuario).filter(MetaUsuario.id_usuario == id_usuario).all()

def eliminar_meta(db: Session, id_meta: int):
    meta = db.query(MetaUsuario).filter(MetaUsuario.id == id_meta).first()
    if meta:
        db.delete(meta)
        db.commit()
    return meta