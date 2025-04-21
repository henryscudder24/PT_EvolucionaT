from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioLogin
from app.database import get_db
from app.crud.usuario import crear_usuario, get_usuario_por_correo
from app.models import models_auto as models

router = APIRouter()

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existente = get_usuario_por_correo(db, usuario.correo)
    if existente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    return crear_usuario(db, usuario)

@router.post("/login", response_model=UsuarioOut)
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.correo == usuario.correo).first()
    
    if not user or user.contrasena != usuario.contrasena:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    return user