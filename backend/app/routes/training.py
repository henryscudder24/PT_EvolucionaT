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
from app.utils.plan_parser import parse_training_plan_table

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

# Configurar OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()
security = HTTPBearer()

@router.get("/training-plan")
async def get_training_plan(
    credentials: HTTPAuthorizationCredentials = Security(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Obtener el plan más reciente del usuario
        plan = db.query(models.PlanRutinaUsuario).filter(
            models.PlanRutinaUsuario.id_usuario == current_user.id
        ).order_by(models.PlanRutinaUsuario.id.desc()).first()
        
        if not plan:
            raise HTTPException(status_code=404, detail="No se encontró un plan de entrenamiento")
        
        # Obtener los días del plan
        dias = db.query(models.PlanEntrenamientoDiario).filter(
            models.PlanEntrenamientoDiario.id_plan_rutina == plan.id
        ).order_by(models.PlanEntrenamientoDiario.fecha).all()
        
        # Construir la respuesta
        plan_completo = []
        for dia in dias:
            ejercicios = db.query(models.DetallePlanEntrenamiento).filter(
                models.DetallePlanEntrenamiento.id_plan_diario == dia.id
            ).all()
            
            # Log de los ejercicios obtenidos de la base de datos
            logger.info(f"Ejercicios del día {dia.fecha}: {[(ej.ejercicio, ej.series, ej.repeticiones) for ej in ejercicios]}")
            
            ejercicios_dia = []
            for ej in ejercicios:
                ejercicio_data = {
                    "nombre": ej.ejercicio,
                    "series": ej.series,
                    "repeticiones": ej.repeticiones,
                    "descanso": "60 seg",
                    "notas": ""
                }
                # Log de cada ejercicio antes de añadirlo
                logger.info(f"Ejercicio a enviar: {ejercicio_data}")
                ejercicios_dia.append(ejercicio_data)
            
            dia_data = {
                "fecha": dia.fecha.strftime("%Y-%m-%d"),
                "tipo_dia": dia.tipo_dia,
                "ejercicios": ejercicios_dia
            }
            # Log del día completo
            logger.info(f"Día completo a enviar: {dia_data}")
            plan_completo.append(dia_data)
        
        # Log de la respuesta completa
        logger.info(f"Respuesta completa del endpoint: {plan_completo}")
        
        return plan_completo
    except Exception as e:
        logger.error(f"Error al obtener el plan de entrenamiento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-training-plan")
async def generate_training_plan(
    credentials: HTTPAuthorizationCredentials = Security(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Obtener datos del usuario
        user_profile = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()
        
        if not user_profile:
            raise HTTPException(status_code=404, detail="Perfil de usuario no encontrado")
        
        # Obtener condición física
        physical_condition = db.query(models.CondicionFisica).filter(
            models.CondicionFisica.id_perfil == user_profile.id
        ).first()
        
        # Obtener ejercicios preferidos
        preferred_exercises = db.query(models.EjercicioPreferido).filter(
            models.EjercicioPreferido.id_perfil == user_profile.id
        ).all()
        
        # Obtener equipamiento disponible
        available_equipment = db.query(models.EquipamientoDisponible).filter(
            models.EquipamientoDisponible.id_perfil == user_profile.id
        ).all()
        
        # Construir el prompt para OpenAI
        prompt = f"""
        Genera un plan de entrenamiento personalizado para un usuario con las siguientes características:
        
        Perfil:
        - Edad: {user_profile.edad} años
        - Género: {user_profile.genero}
        - Peso: {user_profile.peso} kg
        - Altura: {user_profile.altura} cm
        - Objetivo: {user_profile.objetivo_principal}
        - Nivel de actividad: {user_profile.nivel_actividad}
        - Tiempo meta: {user_profile.tiempo_meta}
        - Nivel de compromiso: {user_profile.nivel_compromiso}
        
        Condición Física:
        - Frecuencia de ejercicio: {physical_condition.frecuencia_ejercicio if physical_condition else 'No especificada'}
        - Tiempo disponible: {physical_condition.tiempo_disponible if physical_condition else 'No especificado'}
        
        Ejercicios Preferidos:
        {', '.join([ej.tipo for ej in preferred_exercises]) if preferred_exercises else 'No especificados'}
        
        Equipamiento Disponible:
        {', '.join([eq.equipo for eq in available_equipment]) if available_equipment else 'No especificado'}
        
        Genera una tabla con el siguiente formato:
        | Fecha | Tipo de día | Ejercicio | Series | Repeticiones | Descanso | Notas |
        |-------|-------------|-----------|---------|--------------|----------|-------|
        
        Reglas:
        1. El plan debe cubrir 30 días comenzando desde HOY ({datetime.now().strftime('%d-%m-%Y')})
        2. Incluir días de fuerza, cardio y descanso
        3. Para ejercicios de fuerza:
           - Mínimo 3 series
           - Mínimo 8 repeticiones
           - Descanso entre series: 60-90 segundos
        4. Para ejercicios de cardio:
           - Series: 1
           - Repeticiones: duración en minutos
           - Descanso: según el ejercicio
        5. Los nombres de los ejercicios deben ser completos y correctos
        6. Usar el formato de fecha DD-MM-YYYY
        """
        
        # Generar el plan con OpenAI
        response = openai.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "Eres un experto en entrenamiento y deportes."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=8000
        )
        
        # Extraer la tabla del plan
        plan_text = response.choices[0].message.content
        
        # Parsear el plan
        plan_days = parse_training_plan_table(plan_text)
        
        if not plan_days:
            raise HTTPException(status_code=500, detail="Error al parsear el plan de entrenamiento")
        
        # Crear el plan en la base de datos
        plan_rutina = models.PlanRutinaUsuario(
            id_usuario=current_user.id,
            id_estado_plan=1  # estado activo
        )
        db.add(plan_rutina)
        db.flush()
        
        # Crear los días del plan
        for day in plan_days:
            plan_dia = models.PlanEntrenamientoDiario(
                id_plan_rutina=plan_rutina.id,
                fecha=datetime.strptime(day['fecha'], '%Y-%m-%d'),
                tipo_dia=day['tipo_dia']
            )
            db.add(plan_dia)
            db.flush()
            
            # Crear los ejercicios del día
            for ejercicio in day['ejercicios']:
                # Asegurar valores mínimos para ejercicios de fuerza
                series = ejercicio['series']
                repeticiones = ejercicio['repeticiones']
                
                if day['tipo_dia'].lower() == 'fuerza':
                    series = max(series, 3)
                    repeticiones = max(repeticiones, 8)
                
                detalle = models.DetallePlanEntrenamiento(
                    id_plan_diario=plan_dia.id,
                    ejercicio=ejercicio['nombre'],
                    series=series,
                    repeticiones=repeticiones
                )
                db.add(detalle)
        
        db.commit()
        
        return {"message": "Plan de entrenamiento generado exitosamente"}
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error al generar el plan de entrenamiento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 