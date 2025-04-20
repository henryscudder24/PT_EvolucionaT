from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.meta_usuario import MetaUsuarioCreate, MetaUsuarioOut
from app.crud.meta_usuario import crear_meta, obtener_metas_por_usuario, eliminar_meta

router = APIRouter()

@router.post("/", response_model=MetaUsuarioOut)
def registrar_meta(meta: MetaUsuarioCreate, db: Session = Depends(get_db)):
    return crear_meta(db, meta)

@router.get("/usuario/{id_usuario}", response_model=list[MetaUsuarioOut])
def listar_metas(id_usuario: int, db: Session = Depends(get_db)):
    return obtener_metas_por_usuario(db, id_usuario)

@router.delete("/{id_meta}", response_model=MetaUsuarioOut)
def borrar_meta(id_meta: int, db: Session = Depends(get_db)):
    meta = eliminar_meta(db, id_meta)
    if not meta:
        raise HTTPException(status_code=404, detail="Meta no encontrada")
    return meta