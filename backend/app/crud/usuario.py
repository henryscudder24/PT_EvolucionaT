from sqlalchemy.orm import Session
from app.models.base import User
from app.schemas.usuario import UsuarioCreate
from passlib.hash import bcrypt

def get_usuario_por_correo(db: Session, correo: str):
    return db.query(User).filter(User.email == correo).first()

def crear_usuario(db: Session, datos: UsuarioCreate):
    hashed_password = bcrypt.hash(datos.contraseña)
    usuario = User(
        nombre=datos.nombre,
        email=datos.correo,
        hashed_password=hashed_password
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario