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
        "tipo_nivel_actividad": db.query(models.TipoNivelActividad).all(),
        "estado_plan": db.query(models.EstadoPlan).all(),
        "estado_meta": db.query(models.EstadoMeta).all(),
        "estado_rutina": db.query(models.EstadoRutina).all(),
        "restricciones": db.query(models.RestriccionUsuario).all()
    }