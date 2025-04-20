from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.preferencias_alimentarias import PreferenciaCreate, PreferenciaOut
from app.crud.preferencias_alimentarias import crear_preferencia, listar_por_tipo, eliminar_preferencia

router = APIRouter()

@router.post("/", response_model=PreferenciaOut)
def registrar_preferencia(preferencia: PreferenciaCreate, db: Session = Depends(get_db)):
    return crear_preferencia(db, preferencia)

@router.get("/perfil/{id_perfil}/tipo/{tipo}", response_model=list[PreferenciaOut])
def obtener_preferencias(id_perfil: int, tipo: str, db: Session = Depends(get_db)):
    return listar_por_tipo(db, id_perfil, tipo)

@router.delete("/{id}", response_model=PreferenciaOut)
def borrar_preferencia(id: int, db: Session = Depends(get_db)):
    pref = eliminar_preferencia(db, id)
    if not pref:
        raise HTTPException(status_code=404, detail="Preferencia no encontrada")
    return pref
