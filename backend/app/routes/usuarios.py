from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioLogin, Token
from app.database import get_db
from app.crud.usuario import crear_usuario, get_usuario_por_correo
from app.models import models_auto as models
from passlib.hash import bcrypt
from datetime import timedelta
from config import ACCESS_TOKEN_EXPIRE_MINUTES  
from app.auth.auth import create_access_token, get_current_user

router = APIRouter()

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existente = get_usuario_por_correo(db, usuario.correo)
    if existente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    return crear_usuario(db, usuario)

@router.post("/login", response_model=Token)
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    user = get_usuario_por_correo(db, usuario.correo)
    if not user or not bcrypt.verify(usuario.contraseña, user.contraseña):
        raise HTTPException(status_code=400, detail="Correo o contraseña incorrectos")
    token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub":str(user.id)}, expires_delta=token_expires)
    return Token(
        access_token = token,
        token_type = "bearer",
        user = UsuarioOut.model_validate(user)
    )
    
@router.get("/me", response_model=UsuarioOut)
def read_actual_user(current_user: models.Usuario = Depends(get_current_user)):
    return current_user
