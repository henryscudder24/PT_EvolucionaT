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
from ..utils.health_calculations import calculate_all_metrics
from decimal import Decimal

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
            raise HTTPException(
                status_code=401,
                detail="El correo electrónico no está registrado"
            )
        
        if not bcrypt.verify(usuario.contraseña, user.contraseña):
            logger.warning(f"Contraseña incorrecta para usuario: {usuario.correo}")
            raise HTTPException(
                status_code=401,
                detail="La contraseña es incorrecta"
            )
        
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
        logger.error(f"Error de autenticación: {he.detail}")
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

@router.get("/me/survey-status")
async def get_survey_status(current_user: models.Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        logger.info(f"Verificando estado de encuesta para usuario: {current_user.correo}")
        perfil = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()
        
        logger.info(f"Perfil encontrado: {perfil is not None}")
        
        if not perfil:
            logger.info("No se encontró perfil para el usuario")
            return {"completed": False, "last_updated": None}
            
        # Verificar si tiene datos básicos del perfil
        has_basic_info = all([
            perfil.genero,
            perfil.edad,
            perfil.peso,
            perfil.altura,
            perfil.nivel_actividad
        ])
        logger.info(f"Tiene información básica: {has_basic_info}")
        
        # Verificar si tiene preferencias alimentarias
        has_food_preferences = db.query(models.PreferenciasAlimentarias).filter(
            models.PreferenciasAlimentarias.id_perfil == perfil.id
        ).first() is not None
        logger.info(f"Tiene preferencias alimentarias: {has_food_preferences}")
        
        # Verificar si tiene condición física
        has_fitness = db.query(models.CondicionFisica).filter(
            models.CondicionFisica.id_perfil == perfil.id
        ).first() is not None
        logger.info(f"Tiene condición física: {has_fitness}")
        
        # Verificar si tiene hábitos diarios
        has_habits = db.query(models.HabitosDiarios).filter(
            models.HabitosDiarios.id_perfil == perfil.id
        ).first() is not None
        logger.info(f"Tiene hábitos diarios: {has_habits}")
        
        completed = all([has_basic_info, has_food_preferences, has_fitness, has_habits])
        logger.info(f"Encuesta completada: {completed}")
        
        return {
            "completed": completed,
            "last_updated": None
        }
        
    except Exception as e:
        logger.error(f"Error al verificar estado de encuesta: {str(e)}")
        logger.exception("Detalles del error:")
        raise HTTPException(
            status_code=500,
            detail=f"Error al verificar estado de encuesta: {str(e)}"
        )

@router.get("/me/health-metrics")
async def get_health_metrics(current_user: models.Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        logger.info(f"Obteniendo métricas de salud para usuario: {current_user.correo}")
        perfil = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()
        
        if not perfil:
            raise HTTPException(
                status_code=404,
                detail="No se encontró el perfil del usuario"
            )
            
        if not all([perfil.edad, perfil.genero, perfil.peso, perfil.altura]):
            raise HTTPException(
                status_code=400,
                detail="Faltan datos necesarios para calcular las métricas de salud"
            )
            
        metrics = calculate_all_metrics(
            edad=perfil.edad,
            genero=perfil.genero,
            peso=perfil.peso,
            altura=perfil.altura
        )
        
        return {
            "tmb": metrics["tmb"],
            "peso_ideal": metrics["peso_ideal"],
            "frecuencia_cardiaca_maxima": metrics["frecuencia_cardiaca_maxima"],
            "peso_actual": float(perfil.peso),
            "diferencia_peso": round(float(perfil.peso) - metrics["peso_ideal"], 2)
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error al calcular métricas de salud: {str(e)}")
        logger.exception("Detalles del error:")
        raise HTTPException(
            status_code=500,
            detail=f"Error al calcular métricas de salud: {str(e)}"
        )

@router.post("/calculate-metrics")
async def calculate_metrics(
    data: dict,
    current_user: models.Usuario = Depends(get_current_user)
):
    try:
        logger.info(f"Calculando métricas para usuario: {current_user.correo}")
        
        # Validar datos requeridos
        required_fields = ['edad', 'genero', 'peso', 'altura']
        for field in required_fields:
            if field not in data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Campo requerido: {field}"
                )
        
        # Convertir datos a los tipos correctos
        edad = int(data['edad'])
        genero = str(data['genero'])
        peso = Decimal(str(data['peso']))
        altura = Decimal(str(data['altura']))
        
        # Validar rangos
        if not (15 <= edad <= 100):
            raise HTTPException(
                status_code=400,
                detail="La edad debe estar entre 15 y 100 años"
            )
        
        if not (100 <= altura <= 250):
            raise HTTPException(
                status_code=400,
                detail="La altura debe estar entre 100 y 250 cm"
            )
        
        if not (30 <= peso <= 300):
            raise HTTPException(
                status_code=400,
                detail="El peso debe estar entre 30 y 300 kg"
            )
        
        # Calcular métricas
        metrics = calculate_all_metrics(edad, genero, peso, altura)
        
        return {
            "tmb": metrics["tmb"],
            "peso_ideal": metrics["peso_ideal"],
            "frecuencia_cardiaca_maxima": metrics["frecuencia_cardiaca_maxima"],
            "peso_actual": float(peso),
            "diferencia_peso": round(float(peso) - metrics["peso_ideal"], 2)
        }
        
    except ValueError as ve:
        logger.error(f"Error de validación: {str(ve)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error de validación: {str(ve)}"
        )
    except Exception as e:
        logger.error(f"Error al calcular métricas: {str(e)}")
        logger.exception("Detalles del error:")
        raise HTTPException(
            status_code=500,
            detail=f"Error al calcular métricas: {str(e)}"
        )