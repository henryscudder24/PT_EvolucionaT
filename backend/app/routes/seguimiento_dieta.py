from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.seguimiento_dieta import SeguimientoDietaCreate, SeguimientoDietaOut
from app.crud.seguimiento_dieta import crear_seguimiento, listar_seguimientos

router = APIRouter()

@router.post("/", response_model=SeguimientoDietaOut)
def registrar_seguimiento(seguimiento: SeguimientoDietaCreate, db: Session = Depends(get_db)):
    return crear_seguimiento(db, seguimiento)

@router.get("/plan/{id_plan_dieta}", response_model=list[SeguimientoDietaOut])
def obtener_seguimientos(id_plan_dieta: int, db: Session = Depends(get_db)):
    return listar_seguimientos(db, id_plan_dieta)
