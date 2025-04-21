from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.perfil_restriccion import PerfilRestriccionCreate, PerfilRestriccionOut
from app.crud.perfil_restriccion import agregar_restriccion, listar_por_perfil, eliminar_restriccion

router = APIRouter()

@router.post("/", response_model=PerfilRestriccionOut)
def registrar_restriccion(data: PerfilRestriccionCreate, db: Session = Depends(get_db)):
    return agregar_restriccion(db, data)

@router.get("/perfil/{id_perfil}", response_model=list[PerfilRestriccionOut])
def obtener_restricciones(id_perfil: int, db: Session = Depends(get_db)):
    return listar_por_perfil(db, id_perfil)

@router.delete("/{id}", response_model=PerfilRestriccionOut)
def borrar_restriccion(id: int, db: Session = Depends(get_db)):
    eliminada = eliminar_restriccion(db, id)
    if not eliminada:
        raise HTTPException(status_code=404, detail="Restricción no encontrada")
    return eliminada
