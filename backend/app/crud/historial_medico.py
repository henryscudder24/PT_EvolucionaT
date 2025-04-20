from sqlalchemy.orm import Session
from app.models.models_auto import HistorialMedico
from app.schemas.historial_medico import HistorialMedicoCreate

def crear_historial(db: Session, datos: HistorialMedicoCreate):
    historial = HistorialMedico(**datos.dict())
    db.add(historial)
    db.commit()
    db.refresh(historial)
    return historial

def obtener_historial_por_perfil(db: Session, id_perfil: int):
    return db.query(HistorialMedico).filter(HistorialMedico.id_perfil == id_perfil).first()

def actualizar_historial(db: Session, id: int, datos: HistorialMedicoCreate):
    historial = db.query(HistorialMedico).filter(HistorialMedico.id == id).first()
    if historial:
        for key, value in datos.dict().items():
            setattr(historial, key, value)
        db.commit()
        db.refresh(historial)
    return historial
