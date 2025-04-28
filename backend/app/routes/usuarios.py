from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioLogin
from app.database import get_db
from app.crud.usuario import crear_usuario, get_usuario_por_correo
from app.models import models_auto as models
from passlib.hash import bcrypt
from app.auth import create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existente = get_usuario_por_correo(db, usuario.correo)
    if existente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    return crear_usuario(db, usuario)

@router.post("/login")
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    user = get_usuario_por_correo(db, usuario.correo)
    if not user or not bcrypt.verify(usuario.contraseña, user.contraseña):
        raise HTTPException(status_code=400, detail="Correo o contraseña incorrectos")
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.correo},
        expires_delta=access_token_expires
    )
    
    return {
        "token": access_token,
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "correo": user.correo
        }
    }