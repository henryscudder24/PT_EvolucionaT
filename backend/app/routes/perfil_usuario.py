from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.perfil_usuario import PerfilUsuarioCreate, PerfilUsuarioOut
from app.crud.perfil_usuario import crear_perfil, obtener_perfil_por_usuario, actualizar_perfil

router = APIRouter()

@router.post("/", response_model=PerfilUsuarioOut)
def registrar_perfil(perfil: PerfilUsuarioCreate, db: Session = Depends(get_db)):
    return crear_perfil(db, perfil)

@router.get("/usuario/{id_usuario}", response_model=PerfilUsuarioOut)
def ver_perfil(id_usuario: int, db: Session = Depends(get_db)):
    perfil = obtener_perfil_por_usuario(db, id_usuario)
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return perfil

@router.put("/{id_perfil}", response_model=PerfilUsuarioOut)
def editar_perfil(id_perfil: int, perfil: PerfilUsuarioCreate, db: Session = Depends(get_db)):
    perfil_actualizado = actualizar_perfil(db, id_perfil, perfil)
    if not perfil_actualizado:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return perfil_actualizado