from sqlalchemy.orm import Session
from app.models.models_auto import AlimentosEvitados
from app.schemas.alimentos_evitados import AlimentoEvitadoCreate

def crear_alimento_evitado(db: Session, datos: AlimentoEvitadoCreate):
    nuevo = AlimentosEvitados(**datos.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def listar_evitados_por_perfil(db: Session, id_perfil: int):
    return db.query(AlimentosEvitados).filter(AlimentosEvitados.id_perfil == id_perfil).all()

def eliminar_alimento_evitado(db: Session, id: int):
    alimento = db.query(AlimentosEvitados).filter(AlimentosEvitados.id == id).first()
    if alimento:
        db.delete(alimento)
        db.commit()
    return alimento
