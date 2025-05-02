from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from pydantic import BaseModel
import json
from sqlalchemy import text
import traceback
import logging

from app.database import get_db
from app.auth import get_current_user

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class SeguimientoMetricaBase(BaseModel):
    tipo_metrica: str
    fecha: date
    valor_principal: float
    categoria: Optional[str] = None
    detalles: Optional[dict] = None

    class Config:
        schema_extra = {
            "example": {
                "tipo_metrica": "Peso corporal",
                "fecha": "2024-03-20",
                "valor_principal": 70.5,
                "categoria": "Normal",
                "detalles": {"unidad": "kg"}
            }
        }

class SeguimientoMetricaCreate(SeguimientoMetricaBase):
    pass

class SeguimientoMetrica(SeguimientoMetricaBase):
    id: int
    id_usuario: int

    class Config:
        orm_mode = True

@router.get("/seguimiento-metrica", response_model=List[SeguimientoMetrica])
async def get_seguimiento_metricas(
    tipo_metrica: str = Query(..., description="Tipo de métrica a consultar"),
    fecha_inicio: date = Query(..., description="Fecha de inicio del período"),
    fecha_fin: date = Query(..., description="Fecha de fin del período"),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene el historial de mediciones para una métrica específica en un rango de fechas.
    """
    try:
        logger.debug(f"Usuario ID: {current_user.id}")
        logger.debug(f"Tipo métrica: {tipo_metrica}")
        logger.debug(f"Fecha inicio: {fecha_inicio}")
        logger.debug(f"Fecha fin: {fecha_fin}")

        # Consultar los datos
        query = text("""
            SELECT * FROM seguimiento_metrica 
            WHERE id_usuario = :id_usuario 
            AND tipo_metrica = :tipo_metrica 
            AND fecha BETWEEN :fecha_inicio AND :fecha_fin
            ORDER BY fecha ASC
        """)
        
        params = {
            "id_usuario": current_user.id,
            "tipo_metrica": tipo_metrica,
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin
        }
        logger.debug(f"Parámetros de consulta: {params}")
        
        result = db.execute(query, params)
        seguimientos = result.fetchall()
        logger.debug(f"Número de resultados: {len(seguimientos)}")
        
        if not seguimientos:
            logger.info("No se encontraron resultados")
            return []

        # Convertir resultados a diccionarios
        resultados = []
        for s in seguimientos:
            try:
                resultado = {
                    "id": s[0],  # id
                    "id_usuario": s[1],  # id_usuario
                    "tipo_metrica": s[2],  # tipo_metrica
                    "fecha": s[3],  # fecha
                    "valor_principal": float(s[4]),  # valor_principal
                    "categoria": s[5],  # categoria
                    "detalles": json.loads(s[6]) if s[6] else None  # detalles
                }
                resultados.append(resultado)
            except Exception as e:
                logger.error(f"Error procesando fila: {s}")
                logger.error(f"Error: {str(e)}")
                continue

        logger.debug(f"Resultados procesados: {resultados}")
        return resultados

    except Exception as e:
        logger.error(f"Error en get_seguimiento_metricas: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seguimiento-metrica", response_model=dict)
async def create_seguimiento_metrica(
    seguimiento: SeguimientoMetricaCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Registra una nueva medición de métrica.
    """
    try:
        logger.debug(f"Creando nueva medición para usuario {current_user.id}")
        logger.debug(f"Datos recibidos: {seguimiento.dict()}")

        query = text("""
            INSERT INTO seguimiento_metrica 
            (id_usuario, tipo_metrica, fecha, valor_principal, categoria, detalles)
            VALUES (:id_usuario, :tipo_metrica, :fecha, :valor_principal, :categoria, :detalles)
        """)
        
        params = {
            "id_usuario": current_user.id,
            "tipo_metrica": seguimiento.tipo_metrica,
            "fecha": seguimiento.fecha,
            "valor_principal": seguimiento.valor_principal,
            "categoria": seguimiento.categoria,
            "detalles": json.dumps(seguimiento.detalles) if seguimiento.detalles else None
        }
        logger.debug(f"Parámetros de inserción: {params}")
        
        db.execute(query, params)
        db.commit()
        logger.info("Medición guardada exitosamente")
        return {"message": "Medición guardada correctamente"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error en create_seguimiento_metrica: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e)) 