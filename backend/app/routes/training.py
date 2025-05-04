from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import openai
import os
from dotenv import load_dotenv
from app.database import get_db
from app.models.base import User
from app.auth import get_current_user
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import logging
from app.models import models_auto as models

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

# Configurar OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()
security = HTTPBearer()

@router.post("/generate-training-plan")
async def generate_training_plan(
    credentials: HTTPAuthorizationCredentials = Security(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Obtener datos del usuario
        perfil = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()

        if not perfil:
            raise HTTPException(
                status_code=404,
                detail="Perfil de usuario no encontrado"
            )

        # Obtener ejercicios preferidos
        ejercicios = db.query(models.EjercicioPreferido).filter(
            models.EjercicioPreferido.id_perfil == perfil.id
        ).all()

        # Obtener equipamiento disponible
        equipamiento = db.query(models.EquipamientoDisponible).filter(
            models.EquipamientoDisponible.id_perfil == perfil.id
        ).all()

        # Construir el prompt
        prompt = f"""
        El usuario:
        - Genero: {perfil.genero}
        - Objetivo: {perfil.objetivo_principal}
        - Deporte Preferencia: {', '.join([ej.tipo for ej in ejercicios])}
        - Equipamiento disponible: {', '.join([eq.equipo for eq in equipamiento])}

        Genera una tabla de entrenamiento con columnas:
        Fecha (dd-mm-yyyy) | Deporte | Ejercicio | Repeticiones | Series

        – Cubre desde {datetime.now().strftime('%d-%m-%Y')} hasta {(datetime.now() + timedelta(days=30)).strftime('%d-%m-%Y')}
        – Dentro de ese rango, marca 5 días de entrenamiento y 2 de descanso (en descanso, pon "Descanso" en Deporte y "—" en las demás columnas)
        – Para cada día de entrenamiento, incluye exactamente 5 ejercicios distintos, cada uno en su fila
        – Alterna los tipos de ejercicio según preferencias
        – Devuelve solo la tabla, sin texto adicional.
        """

        # Llamar a OpenAI
        response = openai.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "Eres un experto en entrenamiento y deportes."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=8000
        )

        # Devolver el plan de entrenamiento generado
        return {
            "training_plan": response.choices[0].message.content,
            "generated_at": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Error al generar el plan de entrenamiento: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar el plan de entrenamiento: {str(e)}"
        )

@router.post("/generate-meal-plan")
async def generate_meal_plan(
    credentials: HTTPAuthorizationCredentials = Security(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Obtener datos del usuario
        perfil = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()

        if not perfil:
            raise HTTPException(
                status_code=404,
                detail="Perfil de usuario no encontrado"
            )

        # Obtener preferencias alimentarias
        preferencias = db.query(models.PreferenciasAlimentarias).filter(
            models.PreferenciasAlimentarias.id_perfil == perfil.id
        ).all()

        # Separar preferencias por tipo
        dietas = [p.valor for p in preferencias if p.tipo == 'dieta']
        favoritos = [p.valor for p in preferencias if p.tipo == 'favorito']
        alergias = [p.valor for p in preferencias if p.tipo == 'alergia']

        # Obtener alimentos evitados
        alimentos_evitados = db.query(models.AlimentosEvitados).filter(
            models.AlimentosEvitados.id_perfil == perfil.id
        ).all()
        alimentos_evitar = [a.descripcion for a in alimentos_evitados]

        # Construir el prompt
        prompt = f"""
        El usuario:
        - Genero: {perfil.genero}
        - Objetivo principal: {perfil.objetivo_principal}

        - Dieta a seguir: {', '.join(dietas)}
        - Alimentos favoritos: {', '.join(favoritos)}
        - Alergias: {', '.join(alergias)}
        - Alimentos a evitar: {', '.join(alimentos_evitar)}

        Genera un plan de comidas con las siguientes especificaciones:

        1. Formato de tabla con columnas:
        Fecha (dd-mm-yyyy) | Comida | Plato | Proteínas | Grasas | Carbohidratos | Kcal Totales


        – Cubre desde {datetime.now().strftime('%d-%m-%Y')} hasta {(datetime.now() + timedelta(days=30)).strftime('%d-%m-%Y')}
        – *Importante* Todos los días deben estar representados en la tabla
        – Para cada día incluye Desayuno, Snack 1, Almuerzo, Snack 2 y Cena, cada uno en su fila
        – Respetar estrictamente las alergias y restricciones
        – Priorizar los alimentos favoritos del usuario
        – ¨Importante¨ Devuelve solo la tabla, sin texto adicional ni comentarios.
        """

        # Llamar a OpenAI
        response = openai.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "Eres un experto en nutrición y planificación de comidas, especializado en crear planes personalizados que respetan las preferencias y restricciones del usuario."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=14000
        )

        # Devolver el plan de comidas generado
        return {
            "meal_plan": response.choices[0].message.content,
            "generated_at": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Error al generar el plan de comidas: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar el plan de comidas: {str(e)}"
        ) 