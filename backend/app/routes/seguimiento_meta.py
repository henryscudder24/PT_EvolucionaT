from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.seguimiento_meta import SeguimientoMetaCreate, SeguimientoMetaOut
from app.crud.seguimiento_meta import crear_seguimiento, listar_seguimientos

router = APIRouter()

@router.post("/", response_model=SeguimientoMetaOut)
def registrar_seguimiento(data: SeguimientoMetaCreate, db: Session = Depends(get_db)):
    return crear_seguimiento(db, data)

@router.get("/meta/{id_meta_usuario}", response_model=list[SeguimientoMetaOut])
def obtener_seguimientos(id_meta_usuario: int, db: Session = Depends(get_db)):
    return listar_seguimientos(db, id_meta_usuario)