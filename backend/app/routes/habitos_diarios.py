from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.habitos_diarios import HabitosDiariosCreate, HabitosDiariosOut
from app.crud.habitos_diarios import crear_habitos, obtener_habitos_por_perfil, actualizar_habitos

router = APIRouter()

@router.post("/", response_model=HabitosDiariosOut)
def registrar_habitos(habitos: HabitosDiariosCreate, db: Session = Depends(get_db)):
    return crear_habitos(db, habitos)

@router.get("/perfil/{id_perfil}", response_model=HabitosDiariosOut)
def ver_habitos(id_perfil: int, db: Session = Depends(get_db)):
    habitos = obtener_habitos_por_perfil(db, id_perfil)
    if not habitos:
        raise HTTPException(status_code=404, detail="Hábitos no encontrados")
    return habitos

@router.put("/{id}", response_model=HabitosDiariosOut)
def editar_habitos(id: int, habitos: HabitosDiariosCreate, db: Session = Depends(get_db)):
    actualizados = actualizar_habitos(db, id, habitos)
    if not actualizados:
        raise HTTPException(status_code=404, detail="No se pudo actualizar")
    return actualizados