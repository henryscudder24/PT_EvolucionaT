from sqlalchemy.orm import Session
from app.models.models_auto import PreferenciasAlimentarias
from app.schemas.preferencias_alimentarias import PreferenciaCreate

def crear_preferencia(db: Session, datos: PreferenciaCreate):
    preferencia = PreferenciasAlimentarias(**datos.dict())
    db.add(preferencia)
    db.commit()
    db.refresh(preferencia)
    return preferencia

def listar_por_tipo(db: Session, id_perfil: int, tipo: str):
    return db.query(PreferenciasAlimentarias).filter(
        PreferenciasAlimentarias.id_perfil == id_perfil,
        PreferenciasAlimentarias.tipo == tipo
    ).all()

def eliminar_preferencia(db: Session, id: int):
    pref = db.query(PreferenciasAlimentarias).filter(PreferenciasAlimentarias.id == id).first()
    if pref:
        db.delete(pref)
        db.commit()
    return pref
