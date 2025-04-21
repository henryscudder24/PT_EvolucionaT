from sqlalchemy.orm import Session
from app.models.models_auto import PerfilRestriccion
from app.schemas.perfil_restriccion import PerfilRestriccionCreate

def agregar_restriccion(db: Session, datos: PerfilRestriccionCreate):
    nueva = PerfilRestriccion(**datos.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def listar_por_perfil(db: Session, id_perfil: int):
    return db.query(PerfilRestriccion).filter(
        PerfilRestriccion.id_perfil == id_perfil
    ).all()

def eliminar_restriccion(db: Session, id: int):
    r = db.query(PerfilRestriccion).filter(PerfilRestriccion.id == id).first()
    if r:
        db.delete(r)
        db.commit()
    return r
