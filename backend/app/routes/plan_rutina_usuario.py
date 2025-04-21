from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.plan_rutina_usuario import PlanRutinaCreate, PlanRutinaOut
from app.crud.plan_rutina_usuario import crear_plan_rutina, obtener_plan_por_usuario, actualizar_plan_rutina

router = APIRouter()

@router.post("/", response_model=PlanRutinaOut)
def registrar_plan(plan: PlanRutinaCreate, db: Session = Depends(get_db)):
    return crear_plan_rutina(db, plan)

@router.get("/usuario/{id_usuario}", response_model=PlanRutinaOut)
def ver_plan(id_usuario: int, db: Session = Depends(get_db)):
    plan = obtener_plan_por_usuario(db, id_usuario)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    return plan

@router.put("/{id}", response_model=PlanRutinaOut)
def editar_plan(id: int, plan: PlanRutinaCreate, db: Session = Depends(get_db)):
    actualizado = actualizar_plan_rutina(db, id, plan)
    if not actualizado:
        raise HTTPException(status_code=404, detail="No se pudo actualizar")
    return actualizado
