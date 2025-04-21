from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.alimentos_evitados import AlimentoEvitadoCreate, AlimentoEvitadoOut
from app.crud.alimentos_evitados import crear_alimento_evitado, listar_evitados_por_perfil, eliminar_alimento_evitado

router = APIRouter()

@router.post("/", response_model=AlimentoEvitadoOut)
def registrar_alimento(data: AlimentoEvitadoCreate, db: Session = Depends(get_db)):
    return crear_alimento_evitado(db, data)

@router.get("/perfil/{id_perfil}", response_model=list[AlimentoEvitadoOut])
def listar_por_perfil(id_perfil: int, db: Session = Depends(get_db)):
    return listar_evitados_por_perfil(db, id_perfil)

@router.delete("/{id}", response_model=AlimentoEvitadoOut)
def borrar(id: int, db: Session = Depends(get_db)):
    eliminado = eliminar_alimento_evitado(db, id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="No encontrado")
    return eliminado
