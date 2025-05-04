from fastapi import APIRouter, Depends, HTTPException, Request, status, Security
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
from ..models.base import User
from app.schemas.usuario import UsuarioCreate, UsuarioOut
from app.crud import usuario as crud_usuario
from typing import List
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()

@router.options("/{path:path}")
async def options_handler(request: Request):
    return {"message": "OK"}

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(datos: UsuarioCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    db_usuario = crud_usuario.get_usuario_por_correo(db, datos.correo)
    if db_usuario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado"
        )
    
    # Crear nuevo usuario
    usuario = crud_usuario.crear_usuario(db, datos)
    
    # Convertir el usuario a UsuarioOut
    return UsuarioOut(
        id=usuario.id,
        nombre=usuario.nombre,
        correo=usuario.email
    )

@router.post("/token")
async def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    try:
        logger.info(f"Intento de login para correo: {usuario.correo}")
        user = crud_usuario.get_usuario_por_correo(db, usuario.correo)
        
        if not user:
            logger.warning(f"Usuario no encontrado: {usuario.correo}")
            raise HTTPException(
                status_code=401,
                detail="El correo electrónico no está registrado"
            )
        
        if not bcrypt.verify(usuario.contraseña, user.hashed_password):
            logger.warning(f"Contraseña incorrecta para usuario: {usuario.correo}")
            raise HTTPException(
                status_code=401,
                detail="La contraseña es incorrecta"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
        
        response_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "nombre": user.nombre,
                "correo": user.email
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
async def get_current_user_data(current_user: User = Depends(get_current_user)):
    try:
        logger.info(f"Obteniendo datos del usuario: {current_user.email}")
        return {
            "id": current_user.id,
            "nombre": current_user.nombre,
            "correo": current_user.email
        }
    except Exception as e:
        logger.error(f"Error al obtener datos del usuario: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener datos del usuario")

@router.get("/me/survey-status")
async def get_survey_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        logger.info(f"Verificando estado de encuesta para usuario: {current_user.email}")
        perfil = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()
        
        logger.info(f"Perfil encontrado: {perfil is not None}")
        
        if not perfil:
            logger.info("No se encontró perfil para el usuario")
            return {"completed": False, "last_updated": None}
            
        # Verificar si tiene datos básicos del perfil
        has_basic_info = all([
            perfil.genero is not None and perfil.genero != '',
            perfil.edad is not None and perfil.edad > 0,
            perfil.peso is not None and perfil.peso > 0,
            perfil.altura is not None and perfil.altura > 0,
            perfil.nivel_actividad is not None and perfil.nivel_actividad != '',
            perfil.objetivo_principal is not None and perfil.objetivo_principal != '',
            perfil.tiempo_meta is not None and perfil.tiempo_meta != '',
            perfil.nivel_compromiso is not None and perfil.nivel_compromiso > 0
        ])
        logger.info(f"Tiene información básica: {has_basic_info}")
        logger.info(f"Detalles de información básica: genero={perfil.genero}, edad={perfil.edad}, peso={perfil.peso}, altura={perfil.altura}, nivel_actividad={perfil.nivel_actividad}, objetivo_principal={perfil.objetivo_principal}, tiempo_meta={perfil.tiempo_meta}, nivel_compromiso={perfil.nivel_compromiso}")
        
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
        
        # Verificar si tiene ejercicios preferidos
        has_exercises = db.query(models.EjercicioPreferido).filter(
            models.EjercicioPreferido.id_perfil == perfil.id
        ).first() is not None
        logger.info(f"Tiene ejercicios preferidos: {has_exercises}")
        
        # Verificar si tiene equipamiento
        has_equipment = db.query(models.EquipamientoDisponible).filter(
            models.EquipamientoDisponible.id_perfil == perfil.id
        ).first() is not None
        logger.info(f"Tiene equipamiento: {has_equipment}")
        
        completed = all([
            has_basic_info,
            has_food_preferences,
            has_fitness,
            has_habits,
            has_exercises,
            has_equipment
        ])
        logger.info(f"Estado final de la encuesta: completed={completed}")
        logger.info(f"Detalles de verificación: basic_info={has_basic_info}, food_preferences={has_food_preferences}, fitness={has_fitness}, habits={has_habits}, exercises={has_exercises}, equipment={has_equipment}")
        
        return {
            "completed": completed,
            "last_updated": perfil.updated_at.isoformat() if hasattr(perfil, 'updated_at') and perfil.updated_at else None
        }
        
    except Exception as e:
        logger.error(f"Error al verificar estado de encuesta: {str(e)}")
        logger.exception("Detalles del error:")
        raise HTTPException(
            status_code=500,
            detail=f"Error al verificar estado de encuesta: {str(e)}"
        )

@router.get("/me/health-metrics")
async def get_health_metrics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        logger.info(f"Obteniendo métricas de salud para usuario: {current_user.email}")
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
    credentials: HTTPAuthorizationCredentials = Security(security),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Calculando métricas para usuario: {current_user.email}")
        
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
            "diferencia_peso": round(float(peso) - metrics["peso_ideal"], 2),
            "imc": metrics["imc"]
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