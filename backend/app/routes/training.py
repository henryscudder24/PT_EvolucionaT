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
        Fecha (dd-mm-yyyy) | Deporte | Ejercicio | Repeticiones | Series | Link de ejercicio

        – Cubre desde {datetime.now().strftime('%d-%m-%Y')} hasta {(datetime.now() + timedelta(days=30)).strftime('%d-%m-%Y')}
        – Dentro de ese rango, marca 5 días de entrenamiento y 2 de descanso (en descanso, pon "Descanso" en Deporte y "—" en las demás columnas)
        – Para cada día de entrenamiento, incluye exactamente 5 ejercicios distintos, cada uno en su fila
        – Alterna los tipos de ejercicio según preferencias
        – Añade un enlace válido de YouTube para cada ejercicio. Elige solo URLs que devuelvan status 200 al hacer HEAD.
        – Devuelve solo la tabla, sin texto adicional.
        """

        # Llamar a OpenAI
        response = openai.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "Eres un experto en nutrición y entrenamiento."},
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

        # Construir el prompt
        prompt = f"""
        El usuario:
        - Genero: {perfil.genero}
        - Objetivo: {perfil.objetivo_principal}
        - Dieta a seguir: {', '.join(dietas)}
        - Ingredientes principales: {', '.join(favoritos)}
        - Alimentos a evitar: {', '.join(alergias)}

        Genera una tabla de comidas con columnas:
        Fecha (dd-mm-yyyy) | Comida | Plato | Proteínas | Grasas | Carbohidratos | Kcal Totales | Link de receta

        – Cubre desde {datetime.now().strftime('%d-%m-%Y')} hasta {(datetime.now() + timedelta(days=30)).strftime('%d-%m-%Y')}
        – No saltarse ningún dia desde el dia de hoy hasta el dia 30
        – Cada día incluye 6 comidas debe ser: Desayuno → Snack1 → Almuerzo → Snack2 → Cena → Snack3
        – Ajusta cada plato según restricciones, favoritos y evitar.
        – Añade un enlace válido de YouTube para cada receta. Elige solo URLs que devuelvan status 200 al hacer HEAD.
        – Devuelve solo la tabla, sin texto adicional.
        """

        # Llamar a OpenAI
        response = openai.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "Eres un experto en nutrición y planificación de comidas."},
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