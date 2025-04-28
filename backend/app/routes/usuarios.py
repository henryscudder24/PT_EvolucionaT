from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioLogin, Token, PasswordReset, PasswordResetRequest
from app.database import get_db
from app.crud.usuario import crear_usuario, get_usuario_por_correo, get_user_by_id, actualizar_contraseña
from app.models import models_auto as models
from passlib.hash import bcrypt
from datetime import timedelta
from config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM  
from app.auth.auth import create_token, get_current_user, verify_token
from app.email_notification.notify import send_reset_password_mail
from jose import jwt, JWTError


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
    token = create_token(data={"sub":str(user.id)}, expires_delta=token_expires)
    return Token(
        access_token = token,
        token_type = "bearer",
        user = UsuarioOut.model_validate(user)
    )

@router.post("/password-reset-request", response_model=UsuarioOut)
async def password_reset_request(request: PasswordResetRequest, db:Session = Depends(get_db)):
    email = request.email
    user = get_usuario_por_correo(db, email)
    if not user:
        raise HTTPException(status_code=400, detail="El correo no se encuentra registrado.")
    token_expires = timedelta(minutes=3)
    token = create_token(data={"sub":str(user.id), "reset_password":True}, expires_delta=token_expires)
    url = f"http://localhost:5173/password-reset/{token}"
    #funcion para enviar email
    await send_reset_password_mail(recipient_email=email, user=user.nombre, url=url, expire_in_minutes=3)
    return UsuarioOut.model_validate(user)

@router.get("/password-reset/{token}")
async def reset_password(token: str, db: Session = Depends(get_db)):
    # Verifica token
    payload = verify_token(token, SECRET_KEY, ALGORITHM)
    reset_url = f"http://localhost:5173/password-reset/{token}"
    return {"message": "Token válido", "reset_url": reset_url}
    

@router.post("/password-reset")
def password_reset(data: PasswordReset, db: Session = Depends(get_db)):
    payload = verify_token(data.token, SECRET_KEY, ALGORITHM)
    # Obtenemos el ID del usuario del token
    user_id = int(payload.get("sub"))
    
    # Llamamos a la función que actualiza la contraseña
    usuario = actualizar_contraseña(db, user_id, data.new_password)
    
    return UsuarioOut.model_validate(usuario)

