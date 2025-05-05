from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel
import json
from sqlalchemy import text
import traceback
import logging

from app.database import get_db
from app.auth import get_current_user
from app.models.seguimiento import SeguimientoMetrica, SeguimientoMetricaCreate

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
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class SeguimientoMetricaDelete(BaseModel):
    tipo_metrica: str
    fecha: date
    id: int

    class Config:
        schema_extra = {
            "example": {
                "tipo_metrica": "Peso corporal",
                "fecha": "2024-03-20",
                "id": 1
            }
        }

# Lista de métricas válidas
METRICAS_VALIDAS = [
    'Peso corporal',
    'Medidas corporales',
    'Tasa metabólica basal (TMB)',
    'IMC (Índice de Masa Corporal)',
    'Relación cintura-cadera (WHR)',
    '1RM y cargas máximas',
    'Frecuencia cardíaca en reposo',
    'Calidad del sueño'
]

@router.get("/seguimiento-metrica", response_model=List[SeguimientoMetrica])
async def get_seguimiento_metricas(
    tipo_metrica: Optional[str] = None,
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Obtiene el historial de mediciones de un usuario.
    """
    try:
        query = text("""
            SELECT * FROM seguimiento_metrica 
            WHERE id_usuario = :id_usuario
        """)
        params = {"id_usuario": current_user.id}

        if tipo_metrica:
            query = text(str(query) + " AND tipo_metrica = :tipo_metrica")
            params["tipo_metrica"] = tipo_metrica

        if fecha_inicio:
            query = text(str(query) + " AND fecha >= :fecha_inicio")
            params["fecha_inicio"] = fecha_inicio

        if fecha_fin:
            query = text(str(query) + " AND fecha <= :fecha_fin")
            params["fecha_fin"] = fecha_fin

        query = text(str(query) + " ORDER BY fecha DESC")
        
        result = db.execute(query, params)
        metricas = result.fetchall()
        
        return [
            SeguimientoMetrica(
                id=row.id,
                id_usuario=row.id_usuario,
                tipo_metrica=row.tipo_metrica,
                fecha=row.fecha,
                valor_principal=float(row.valor_principal),
                categoria=row.categoria,
                detalles=json.loads(row.detalles) if row.detalles else None,
                created_at=row.created_at,
                updated_at=row.updated_at
            )
            for row in metricas
        ]
    except Exception as e:
        logger.error(f"Error al obtener métricas: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seguimiento-metrica", response_model=SeguimientoMetrica)
async def create_seguimiento_metrica(
    metrica: SeguimientoMetricaCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Crea una nueva medición de métrica.
    """
    try:
        # Validar tipo de métrica
        if metrica.tipo_metrica not in METRICAS_VALIDAS:
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de métrica inválido. Debe ser uno de: {', '.join(METRICAS_VALIDAS)}"
            )

        # Preparar detalles como JSON
        detalles_json = json.dumps(metrica.detalles) if metrica.detalles else None

        # Insertar nueva métrica
        query = text("""
            INSERT INTO seguimiento_metrica 
            (id_usuario, tipo_metrica, fecha, valor_principal, categoria, detalles)
            VALUES (:id_usuario, :tipo_metrica, :fecha, :valor_principal, :categoria, :detalles)
        """)
        
        db.execute(
            query,
            {
                "id_usuario": current_user.id,
                "tipo_metrica": metrica.tipo_metrica,
                "fecha": metrica.fecha,
                "valor_principal": metrica.valor_principal,
                "categoria": metrica.categoria,
                "detalles": detalles_json
            }
        )
        db.commit()

        # Obtener el registro recién insertado
        get_query = text("""
            SELECT * FROM seguimiento_metrica 
            WHERE id_usuario = :id_usuario 
            AND tipo_metrica = :tipo_metrica 
            AND fecha = :fecha 
            ORDER BY id DESC 
            LIMIT 1
        """)
        
        result = db.execute(
            get_query,
            {
                "id_usuario": current_user.id,
                "tipo_metrica": metrica.tipo_metrica,
                "fecha": metrica.fecha
            }
        )
        
        new_metrica = result.fetchone()
        return SeguimientoMetrica(
            id=new_metrica.id,
            id_usuario=new_metrica.id_usuario,
            tipo_metrica=new_metrica.tipo_metrica,
            fecha=new_metrica.fecha,
            valor_principal=float(new_metrica.valor_principal),
            categoria=new_metrica.categoria,
            detalles=json.loads(new_metrica.detalles) if new_metrica.detalles else None,
            created_at=new_metrica.created_at,
            updated_at=new_metrica.updated_at
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error al crear métrica: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seguimiento-metrica/delete")
async def delete_seguimiento_metrica(
    id_metrica: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Elimina una medición de métrica.
    """
    try:
        # Verificar que la métrica pertenece al usuario
        query = text("""
            SELECT id FROM seguimiento_metrica 
            WHERE id = :id_metrica AND id_usuario = :id_usuario
        """)
        result = db.execute(
            query,
            {
                "id_metrica": id_metrica,
                "id_usuario": current_user.id
            }
        )
        
        if not result.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Métrica no encontrada o no tienes permiso para eliminarla"
            )

        # Eliminar la métrica
        delete_query = text("""
            DELETE FROM seguimiento_metrica 
            WHERE id = :id_metrica AND id_usuario = :id_usuario
        """)
        db.execute(
            delete_query,
            {
                "id_metrica": id_metrica,
                "id_usuario": current_user.id
            }
        )
        db.commit()
        
        return {"message": "Métrica eliminada correctamente"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error al eliminar métrica: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e)) 