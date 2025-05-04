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
from app.utils.plan_parser import parse_meal_plan_table

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

# Configurar OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()
security = HTTPBearer()

@router.get("/meal-plan")
async def get_meal_plan(
    credentials: HTTPAuthorizationCredentials = Security(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Obtener el plan de dieta más reciente del usuario
        plan_dieta = db.query(models.PlanDietaUsuario).filter(
            models.PlanDietaUsuario.id_usuario == current_user.id
        ).order_by(models.PlanDietaUsuario.id.desc()).first()

        if not plan_dieta:
            raise HTTPException(
                status_code=404,
                detail="No se encontró un plan de comidas"
            )

        # Obtener los días del plan
        dias_plan = db.query(models.PlanComidasDiario).filter(
            models.PlanComidasDiario.id_plan_dieta == plan_dieta.id
        ).order_by(models.PlanComidasDiario.fecha).all()

        # Obtener los detalles de cada día
        plan_completo = []
        for dia in dias_plan:
            detalles = db.query(models.DetallePlanComidas).filter(
                models.DetallePlanComidas.id_plan_diario == dia.id
            ).all()

            plan_completo.append({
                "fecha": dia.fecha.isoformat(),
                "comidas": [
                    {
                        "tipo_comida": detalle.tipo_comida,
                        "plato": detalle.plato,
                        "proteinas": detalle.proteinas,
                        "grasas": detalle.grasas,
                        "carbohidratos": detalle.carbohidratos,
                        "calorias": detalle.calorias
                    }
                    for detalle in detalles
                ]
            })

        return plan_completo

    except Exception as e:
        logger.error(f"Error al obtener el plan de comidas: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener el plan de comidas: {str(e)}"
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

        # Obtener alimentos evitados
        alimentos_evitados = db.query(models.AlimentosEvitados).filter(
            models.AlimentosEvitados.id_perfil == perfil.id
        ).all()

        # Construir el prompt
        prompt = f"""
        El usuario:
        - Objetivo: {perfil.objetivo_principal}
        - Preferencias alimentarias: {', '.join([f"{p.tipo}: {p.valor}" for p in preferencias])}
        - Alimentos evitados: {', '.join([a.descripcion for a in alimentos_evitados])}

        Genera una tabla de plan de comidas con columnas:
        Fecha (dd-mm-yyyy) | Comida | Plato | Proteínas | Grasas | Carbohidratos | Kcal Totales

        – Cubre desde {datetime.now().strftime('%d-%m-%Y')} hasta {(datetime.now() + timedelta(days=30)).strftime('%d-%m-%Y')}
        – Para cada día, incluye 5 comidas: Desayuno, Almuerzo, Cena, y 2 Snacks
        – Cada comida debe tener sus macronutrientes y calorías
        – Devuelve solo la tabla, sin texto adicional.
        """

        # Llamar a OpenAI
        response = openai.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "Eres un experto en nutrición y dietética."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=8000
        )

        # Obtener el plan generado
        plan_text = response.choices[0].message.content

        # Crear el plan de dieta principal
        plan_dieta = models.PlanDietaUsuario(
            id_usuario=current_user.id,
            id_estado_plan=1  # estado activo
        )
        db.add(plan_dieta)
        db.flush()

        # Parsear y almacenar el plan
        plan_datos = parse_meal_plan_table(plan_text)
        
        for dia in plan_datos:
            # Crear el día de comidas
            plan_diario = models.PlanComidasDiario(
                id_plan_dieta=plan_dieta.id,
                fecha=dia['fecha']
            )
            db.add(plan_diario)
            db.flush()

            # Agregar las comidas del día
            for comida in dia['comidas']:
                detalle = models.DetallePlanComidas(
                    id_plan_diario=plan_diario.id,
                    tipo_comida=comida['tipo_comida'],
                    plato=comida['plato'],
                    proteinas=comida['proteinas'],
                    grasas=comida['grasas'],
                    carbohidratos=comida['carbohidratos'],
                    calorias=comida['calorias']
                )
                db.add(detalle)

        # Hacer commit de todos los cambios
        db.commit()

        # Devolver el plan de comidas generado
        return {
            "meal_plan": plan_text,
            "generated_at": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Error al generar el plan de comidas: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar el plan de comidas: {str(e)}"
        ) 