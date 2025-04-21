from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.plan_dieta_usuario import PlanDietaCreate, PlanDietaOut
from app.crud.plan_dieta_usuario import crear_plan_dieta, obtener_plan_usuario, actualizar_plan

router = APIRouter()

@router.post("/", response_model=PlanDietaOut)
def registrar_plan(plan: PlanDietaCreate, db: Session = Depends(get_db)):
    return crear_plan_dieta(db, plan)

@router.get("/usuario/{id_usuario}", response_model=PlanDietaOut)
def ver_plan(id_usuario: int, db: Session = Depends(get_db)):
    plan = obtener_plan_usuario(db, id_usuario)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    return plan

@router.put("/{id}", response_model=PlanDietaOut)
def editar_plan(id: int, plan: PlanDietaCreate, db: Session = Depends(get_db)):
    actualizado = actualizar_plan(db, id, plan)
    if not actualizado:
        raise HTTPException(status_code=404, detail="No se pudo actualizar el plan")
    return actualizado
