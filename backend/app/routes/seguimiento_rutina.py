from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.seguimiento_rutina import SeguimientoRutinaCreate, SeguimientoRutinaOut
from app.crud.seguimiento_rutina import crear_seguimiento, listar_seguimientos

router = APIRouter()

@router.post("/", response_model=SeguimientoRutinaOut)
def registrar_seguimiento(seguimiento: SeguimientoRutinaCreate, db: Session = Depends(get_db)):
    return crear_seguimiento(db, seguimiento)

@router.get("/plan/{id_plan_rutina}", response_model=list[SeguimientoRutinaOut])
def obtener_seguimientos(id_plan_rutina: int, db: Session = Depends(get_db)):
    return listar_seguimientos(db, id_plan_rutina)
