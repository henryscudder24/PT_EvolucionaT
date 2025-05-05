from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import date

class SeguimientoMetricaBase(BaseModel):
    tipo_metrica: str = Field(..., description="Tipo de métrica a registrar")
    fecha: date = Field(..., description="Fecha de la medición")
    valor_principal: float = Field(..., description="Valor principal de la medición")
    categoria: Optional[str] = Field(None, description="Categoría o clasificación de la medición")
    detalles: Optional[Dict[str, Any]] = Field(None, description="Detalles adicionales de la medición")

class SeguimientoMetricaCreate(SeguimientoMetricaBase):
    pass

class SeguimientoMetrica(SeguimientoMetricaBase):
    id: int
    id_usuario: int
    created_at: date
    updated_at: date

    class Config:
        from_attributes = True 