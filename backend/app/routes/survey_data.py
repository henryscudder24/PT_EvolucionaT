from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.base import User
from app.auth import get_current_user
from app.models import models_auto as models
from typing import Dict, Any
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import logging

router = APIRouter()

security = HTTPBearer()

@router.get("/survey-data", 
    summary="Obtener datos de la encuesta",
    description="Obtiene todos los datos de la encuesta del usuario actual en formato JSON",
    response_description="Datos de la encuesta en formato JSON")
async def get_survey_data(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Obtiene todos los datos de la encuesta del usuario actual en formato JSON.
    Requiere autenticación mediante token JWT en el header Authorization: Bearer <token>
    """
    try:
        # Obtener el perfil del usuario
        perfil = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()

        if not perfil:
            raise HTTPException(status_code=404, detail="Perfil no encontrado")

        # Obtener todos los datos relacionados
        historial_medico = db.query(models.HistorialMedico).filter(
            models.HistorialMedico.id_perfil == perfil.id
        ).first()

        preferencias = db.query(models.PreferenciasAlimentarias).filter(
            models.PreferenciasAlimentarias.id_perfil == perfil.id
        ).all()

        objetivos = db.query(models.MetaUsuario).filter(
            models.MetaUsuario.id_usuario == current_user.id
        ).first()

        habitos = db.query(models.HabitosDiarios).filter(
            models.HabitosDiarios.id_perfil == perfil.id
        ).first()

        # Obtener ejercicios preferidos
        ejercicios = db.query(models.EjercicioPreferido).filter(
            models.EjercicioPreferido.id_perfil == perfil.id
        ).all()

        # Obtener equipamiento disponible
        equipamiento = db.query(models.EquipamientoDisponible).filter(
            models.EquipamientoDisponible.id_perfil == perfil.id
        ).all()

        # Construir el JSON con la estructura de tablas y columnas
        survey_data = {
            "perfil_usuario": {
                "tabla": "perfil_usuario",
                "columnas": {
                    "id": perfil.id,
                    "id_usuario": perfil.id_usuario,
                    "genero": perfil.genero,
                    "edad": perfil.edad,
                    "altura": perfil.altura,
                    "peso": perfil.peso,
                    "nivel_actividad": perfil.nivel_actividad,
                    "objetivo_principal": perfil.objetivo_principal,
                    "tiempo_meta": perfil.tiempo_meta,
                    "nivel_compromiso": perfil.nivel_compromiso,
                    "medicion_progreso": perfil.medicion_progreso
                }
            },
            "historial_medico": {
                "tabla": "historial_medico",
                "columnas": {
                    "id": historial_medico.id if historial_medico else None,
                    "id_perfil": historial_medico.id_perfil if historial_medico else None,
                    "condicion_cronica": historial_medico.condicion_cronica if historial_medico else None,
                    "medicamentos": historial_medico.medicamentos if historial_medico else None,
                    "lesiones": historial_medico.lesiones if historial_medico else None,
                    "antecedentes_familiares": historial_medico.antecedentes_familiares if historial_medico else None,
                    "otras_condiciones": historial_medico.otras_condiciones if historial_medico else None
                }
            },
            "preferencias_alimentarias": {
                "tabla": "preferencias_alimentarias",
                "registros": [
                    {
                        "id": pref.id,
                        "id_perfil": pref.id_perfil,
                        "tipo": pref.tipo,
                        "valor": pref.valor,
                        "otros_alergias": pref.otros_alergias,
                        "otros_alimentos_favoritos": pref.otros_alimentos_favoritos
                    } for pref in preferencias
                ]
            },
            "metas_objetivos": {
                "tabla": "meta_usuario",
                "columnas": {
                    "id": objetivos.id if objetivos else None,
                    "id_usuario": objetivos.id_usuario if objetivos else None,
                    "id_tipo_objetivo": objetivos.id_tipo_objetivo if objetivos else None
                }
            },
            "habitos_diarios": {
                "tabla": "habitos_diarios",
                "columnas": {
                    "id": habitos.id if habitos else None,
                    "id_perfil": habitos.id_perfil if habitos else None,
                    "horas_sueno": habitos.horas_sueno if habitos else None,
                    "calidad_sueno": habitos.calidad_sueno if habitos else None,
                    "nivel_estres": habitos.nivel_estres if habitos else None,
                    "agua_dia": habitos.agua_dia if habitos else None,
                    "comidas_dia": habitos.comidas_dia if habitos else None,
                    "habitos_snack": habitos.habitos_snack if habitos else None,
                    "horas_pantalla": habitos.horas_pantalla if habitos else None,
                    "tipo_trabajo": habitos.tipo_trabajo if habitos else None
                }
            },
            "ejercicios_preferidos": {
                "tabla": "ejercicio_preferido",
                "registros": [
                    {
                        "id": ejercicio.id,
                        "id_perfil": ejercicio.id_perfil,
                        "tipo": ejercicio.tipo
                    } for ejercicio in ejercicios
                ]
            },
            "equipamiento_disponible": {
                "tabla": "equipamiento_disponible",
                "registros": [
                    {
                        "id": equipo.id,
                        "id_perfil": equipo.id_perfil,
                        "equipo": equipo.equipo
                    } for equipo in equipamiento
                ]
            }
        }

        return survey_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 