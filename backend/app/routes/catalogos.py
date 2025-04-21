from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import models_auto as models

router = APIRouter()

@router.get("/")
def obtener_catalogos(db: Session = Depends(get_db)):
    return {
        "tipo_usuario": db.query(models.TipoUsuario).all(),
        "tipo_objetivo": db.query(models.TipoObjetivo).all(),
        "tipo_dieta": db.query(models.TipoDieta).all(),
        "nivel_actividad": [
            {"clave": "sedentario", "descripcion": "Sedentario (poco o nada de ejercicio)"},
            {"clave": "moderado", "descripcion": "Moderado (ejercicio ligero 1-3 días/semana)"},
            {"clave": "activo", "descripcion": "Activo (ejercicio moderado 3-5 días/semana)"},
            {"clave": "muy_activo", "descripcion": "Muy activo (ejercicio intenso 6-7 días/semana)"},
            {"clave": "extremo", "descripcion": "Extremadamente activo (atletas, actividad física muy intensa)"},
        ],
        "estado_plan": db.query(models.EstadoPlan).all(),
        "estado_meta": db.query(models.EstadoMeta).all(),
        "estado_rutina": db.query(models.EstadoRutina).all(),
        "restricciones": db.query(models.RestriccionUsuario).all(),
        
        "dietas_sugeridas": db.query(models.PreferenciasAlimentarias).filter(
            models.PreferenciasAlimentarias.tipo == "dieta",
            models.PreferenciasAlimentarias.id_perfil == 0
        ).all(),

        "alergias_sugeridas": db.query(models.PreferenciasAlimentarias).filter(
            models.PreferenciasAlimentarias.tipo == "alergia",
            models.PreferenciasAlimentarias.id_perfil == 0
        ).all(),

        "favoritos_sugeridos": db.query(models.PreferenciasAlimentarias).filter(
            models.PreferenciasAlimentarias.tipo == "favorito",
            models.PreferenciasAlimentarias.id_perfil == 0
        ).all(),
    }
    