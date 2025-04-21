from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.progreso_usuario import ProgresoUsuarioCreate, ProgresoUsuarioOut
from app.crud.progreso_usuario import crear_progreso, listar_progreso_usuario, eliminar_progreso

router = APIRouter()

@router.post("/", response_model=ProgresoUsuarioOut)
def registrar_progreso(progreso: ProgresoUsuarioCreate, db: Session = Depends(get_db)):
    return crear_progreso(db, progreso)

@router.get("/usuario/{id_usuario}", response_model=list[ProgresoUsuarioOut])
def obtener_progresos(id_usuario: int, db: Session = Depends(get_db)):
    return listar_progreso_usuario(db, id_usuario)

@router.delete("/{id}", response_model=ProgresoUsuarioOut)
def borrar_progreso(id: int, db: Session = Depends(get_db)):
    eliminado = eliminar_progreso(db, id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="No encontrado")
    return eliminado
