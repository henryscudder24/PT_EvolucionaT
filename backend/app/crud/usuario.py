from sqlalchemy.orm import Session
from app.models.models_auto import Usuario
from app.schemas.usuario import UsuarioCreate
from passlib.hash import bcrypt

def get_usuario_por_correo(db: Session, correo: str):
    return db.query(Usuario).filter(Usuario.correo == correo).first()

def get_user_by_id(db: Session, id: int):
    return db.query(Usuario).filter(Usuario.id == id).first()

def crear_usuario(db: Session, datos: UsuarioCreate):
    hashed_password = bcrypt.hash(datos.contraseña)
    usuario = Usuario(
        nombre=datos.nombre,
        correo=datos.correo,
        contraseña=hashed_password
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario