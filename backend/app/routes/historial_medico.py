from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.historial_medico import HistorialMedicoCreate, HistorialMedicoOut
from app.crud.historial_medico import crear_historial, obtener_historial_por_perfil, actualizar_historial

router = APIRouter()

@router.post("/", response_model=HistorialMedicoOut)
def registrar_historial(historial: HistorialMedicoCreate, db: Session = Depends(get_db)):
    return crear_historial(db, historial)

@router.get("/perfil/{id_perfil}", response_model=HistorialMedicoOut)
def ver_historial(id_perfil: int, db: Session = Depends(get_db)):
    historial = obtener_historial_por_perfil(db, id_perfil)
    if not historial:
        raise HTTPException(status_code=404, detail="Historial no encontrado")
    return historial

@router.put("/{id}", response_model=HistorialMedicoOut)
def editar_historial(id: int, historial: HistorialMedicoCreate, db: Session = Depends(get_db)):
    actualizado = actualizar_historial(db, id, historial)
    if not actualizado:
        raise HTTPException(status_code=404, detail="No se pudo actualizar el historial")
    return actualizado
