from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from pydantic import BaseModel
import json

from database import get_db
from auth import get_current_user

router = APIRouter(
    tags=["seguimiento"],
    responses={404: {"description": "Not found"}},
)

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
        query = """
            SELECT * FROM Seguimiento_Metrica 
            WHERE id_usuario = :id_usuario 
            AND tipo_metrica = :tipo_metrica 
            AND fecha BETWEEN :fecha_inicio AND :fecha_fin
            ORDER BY fecha ASC
        """
        result = db.execute(
            query,
            {
                "id_usuario": current_user.id,
                "tipo_metrica": tipo_metrica,
                "fecha_inicio": fecha_inicio,
                "fecha_fin": fecha_fin
            }
        )
        seguimientos = result.fetchall()
        
        return [
            {
                "id": s.id,
                "tipo_metrica": s.tipo_metrica,
                "fecha": s.fecha,
                "valor_principal": float(s.valor_principal),
                "categoria": s.categoria,
                "detalles": json.loads(s.detalles) if s.detalles else None
            }
            for s in seguimientos
        ]
    except Exception as e:
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
        query = """
            INSERT INTO Seguimiento_Metrica 
            (id_usuario, tipo_metrica, fecha, valor_principal, categoria, detalles)
            VALUES (:id_usuario, :tipo_metrica, :fecha, :valor_principal, :categoria, :detalles)
        """
        db.execute(
            query,
            {
                "id_usuario": current_user.id,
                "tipo_metrica": seguimiento.tipo_metrica,
                "fecha": seguimiento.fecha,
                "valor_principal": seguimiento.valor_principal,
                "categoria": seguimiento.categoria,
                "detalles": json.dumps(seguimiento.detalles) if seguimiento.detalles else None
            }
        )
        db.commit()
        return {"message": "Medición guardada correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) 