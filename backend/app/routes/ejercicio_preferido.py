from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.ejercicio_preferido import EjercicioPreferidoCreate, EjercicioPreferidoOut
from app.crud.ejercicio_preferido import crear_ejercicio, listar_por_perfil, eliminar_ejercicio

router = APIRouter()

@router.post("/", response_model=EjercicioPreferidoOut)
def registrar_ejercicio(data: EjercicioPreferidoCreate, db: Session = Depends(get_db)):
    return crear_ejercicio(db, data)

@router.get("/perfil/{id_perfil}", response_model=list[EjercicioPreferidoOut])
def obtener_ejercicios(id_perfil: int, db: Session = Depends(get_db)):
    return listar_por_perfil(db, id_perfil)

@router.delete("/{id}", response_model=EjercicioPreferidoOut)
def borrar_ejercicio(id: int, db: Session = Depends(get_db)):
    ejercicio = eliminar_ejercicio(db, id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    return ejercicio
