from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.schemas import UsuarioCreate, UsuarioOut, UsuarioLogin
from app.database import get_db
from app.crud.usuario import crear_usuario, get_usuario_por_correo
from app.models import models_auto as models
from passlib.hash import bcrypt
from app.auth import create_access_token, get_current_user
from datetime import timedelta
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.options("/{path:path}")
async def options_handler(request: Request):
    return {"message": "OK"}

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        existente = get_usuario_por_correo(db, usuario.correo)
        if existente:
            raise HTTPException(status_code=400, detail="El correo ya está registrado.")
        return crear_usuario(db, usuario)
    except Exception as e:
        logger.error(f"Error en registro: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    try:
        logger.info(f"Intento de login para correo: {usuario.correo}")
        user = get_usuario_por_correo(db, usuario.correo)
        
        if not user:
            logger.warning(f"Usuario no encontrado: {usuario.correo}")
            raise HTTPException(status_code=400, detail="Correo o contraseña incorrectos")
        
        if not bcrypt.verify(usuario.contraseña, user.contraseña):
            logger.warning(f"Contraseña incorrecta para usuario: {usuario.correo}")
            raise HTTPException(status_code=400, detail="Correo o contraseña incorrectos")
        
        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user.correo},
            expires_delta=access_token_expires
        )
        
        response_data = {
            "token": access_token,
            "user": {
                "id": user.id,
                "nombre": user.nombre,
                "correo": user.correo
            }
        }
        logger.info(f"Login exitoso para usuario: {usuario.correo}")
        return response_data
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/me", response_model=UsuarioOut)
async def get_current_user_data(current_user: models.Usuario = Depends(get_current_user)):
    try:
        logger.info(f"Obteniendo datos del usuario: {current_user.correo}")
        return {
            "id": current_user.id,
            "nombre": current_user.nombre,
            "correo": current_user.correo
        }
    except Exception as e:
        logger.error(f"Error al obtener datos del usuario: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener datos del usuario")