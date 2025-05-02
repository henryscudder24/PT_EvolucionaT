from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from app.database import get_db
from app.models import models_auto as models
from ..models.base import User
from ..schemas import survey as schemas
from app.auth import get_current_user
from sqlalchemy.sql import func

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/survey/complete", response_model=dict)
async def complete_survey(
    survey_data: schemas.SurveyDataResponse,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Recibiendo datos de encuesta para usuario {current_user.id}")
        logger.info(f"Datos recibidos: {survey_data.model_dump_json()}")
        
        # Validar que el usuario existe
        if not current_user:
            raise HTTPException(
                status_code=400,
                detail="Usuario no encontrado"
            )

        # 1. Crear o actualizar perfil de usuario
        perfil = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()

        if not perfil:
            logger.info("Creando nuevo perfil de usuario")
            perfil = models.PerfilUsuario(
                id_usuario=current_user.id,
                genero=survey_data.personalInfo.genero,
                edad=survey_data.personalInfo.edad,
                altura=survey_data.personalInfo.altura,
                peso=survey_data.personalInfo.peso,
                nivel_actividad=survey_data.personalInfo.nivelActividad,
                objetivo_principal=survey_data.goalsObjectives.objetivoPrincipal,
                tiempo_meta=survey_data.goalsObjectives.tiempoMeta,
                nivel_compromiso=survey_data.goalsObjectives.nivelCompromiso,
                medicion_progreso=survey_data.goalsObjectives.medicionProgreso
            )
            db.add(perfil)
            db.flush()
            logger.info("Perfil de usuario creado exitosamente")
        else:
            logger.info("Actualizando perfil de usuario existente")
            perfil.genero = survey_data.personalInfo.genero
            perfil.edad = survey_data.personalInfo.edad
            perfil.altura = survey_data.personalInfo.altura
            perfil.peso = survey_data.personalInfo.peso
            perfil.nivel_actividad = survey_data.personalInfo.nivelActividad
            perfil.objetivo_principal = survey_data.goalsObjectives.objetivoPrincipal
            perfil.tiempo_meta = survey_data.goalsObjectives.tiempoMeta
            perfil.nivel_compromiso = survey_data.goalsObjectives.nivelCompromiso
            perfil.medicion_progreso = survey_data.goalsObjectives.medicionProgreso
            db.flush()
            logger.info("Perfil de usuario actualizado exitosamente")

        # 2. Limpiar datos anteriores
        logger.info("Limpiando datos anteriores")
        db.query(models.PreferenciasAlimentarias).filter(
            models.PreferenciasAlimentarias.id_perfil == perfil.id
        ).delete()
        db.query(models.AlimentosEvitados).filter(
            models.AlimentosEvitados.id_perfil == perfil.id
        ).delete()
        db.query(models.CondicionFisica).filter(
            models.CondicionFisica.id_perfil == perfil.id
        ).delete()
        db.query(models.EjercicioPreferido).filter(
            models.EjercicioPreferido.id_perfil == perfil.id
        ).delete()
        db.query(models.EquipamientoDisponible).filter(
            models.EquipamientoDisponible.id_perfil == perfil.id
        ).delete()
        db.query(models.HistorialMedico).filter(
            models.HistorialMedico.id_perfil == perfil.id
        ).delete()
        db.query(models.HabitosDiarios).filter(
            models.HabitosDiarios.id_perfil == perfil.id
        ).delete()
        db.flush()
        logger.info("Datos anteriores limpiados exitosamente")

        # 3. Guardar preferencias alimentarias
        logger.info("Guardando preferencias alimentarias")
        
        # Guardar tipo de dieta
        for tipo in survey_data.foodPreferences.tipoDieta:
            preferencia = models.PreferenciasAlimentarias(
                id_perfil=perfil.id,
                tipo='dieta',
                valor=tipo
            )
            db.add(preferencia)
            logger.info(f"Agregada preferencia de dieta: {tipo}")

        # Guardar alergias
        for alergia in survey_data.foodPreferences.alergias:
            preferencia = models.PreferenciasAlimentarias(
                id_perfil=perfil.id,
                tipo='alergia',
                valor=alergia,
                otros_alergias=survey_data.foodPreferences.otrosAlergias if alergia == 'Otro' else None
            )
            db.add(preferencia)
            logger.info(f"Agregada alergia: {alergia}")

        # Guardar alimentos favoritos
        for favorito in survey_data.foodPreferences.alimentosFavoritos:
            preferencia = models.PreferenciasAlimentarias(
                id_perfil=perfil.id,
                tipo='favorito',
                valor=favorito,
                otros_alimentos_favoritos=survey_data.foodPreferences.otrosAlimentosFavoritos if favorito == 'Otros' else None
            )
            db.add(preferencia)
            logger.info(f"Agregado alimento favorito: {favorito}")

        # 4. Guardar alimentos evitados
        for alimento in survey_data.foodPreferences.alimentosEvitados:
            alimentos_evitados = models.AlimentosEvitados(
                id_perfil=perfil.id,
                descripcion=alimento
            )
            db.add(alimentos_evitados)
            logger.info(f"Agregado alimento evitado: {alimento}")

        # 5. Guardar condición física
        logger.info("Guardando condición física")
        condicion = models.CondicionFisica(
            id_perfil=perfil.id,
            frecuencia_ejercicio=survey_data.physicalCondition.frecuenciaEjercicio,
            tiempo_disponible=survey_data.physicalCondition.tiempoDisponible
        )
        db.add(condicion)
        logger.info("Condición física guardada exitosamente")

        # 6. Guardar ejercicios preferidos
        for ejercicio in survey_data.physicalCondition.ejerciciosPreferidos:
            ejercicio_pref = models.EjercicioPreferido(
                id_perfil=perfil.id,
                tipo=ejercicio
            )
            db.add(ejercicio_pref)
            logger.info(f"Agregado ejercicio preferido: {ejercicio}")

        # 7. Guardar equipamiento disponible
        for equipo in survey_data.physicalCondition.equipamientoDisponible:
            equipamiento = models.EquipamientoDisponible(
                id_perfil=perfil.id,
                equipo=equipo
            )
            db.add(equipamiento)
            logger.info(f"Agregado equipamiento: {equipo}")

        # 8. Guardar historial médico
        logger.info("Guardando historial médico")
        historial = models.HistorialMedico(
            id_perfil=perfil.id,
            condicion_cronica=survey_data.medicalHistory.condicionCronica,
            otras_condiciones=survey_data.medicalHistory.otrasCondiciones,
            medicamentos=survey_data.medicalHistory.medicamentos,
            lesiones=survey_data.medicalHistory.lesiones,
            antecedentes_familiares=survey_data.medicalHistory.antecedentesFamiliares
        )
        db.add(historial)
        logger.info("Historial médico guardado exitosamente")

        # 9. Guardar hábitos diarios
        logger.info("Guardando hábitos diarios")
        habitos = models.HabitosDiarios(
            id_perfil=perfil.id,
            horas_sueno=survey_data.dailyHabits.horasSueno,
            calidad_sueno=survey_data.dailyHabits.calidadSueno,
            nivel_estres=survey_data.dailyHabits.nivelEstres,
            agua_dia=survey_data.dailyHabits.aguaDia,
            comidas_dia=survey_data.dailyHabits.comidasDia,
            habitos_snack=survey_data.dailyHabits.habitosSnack,
            horas_pantalla=survey_data.dailyHabits.horasPantalla,
            tipo_trabajo=survey_data.dailyHabits.tipoTrabajo
        )
        db.add(habitos)
        logger.info("Hábitos diarios guardados exitosamente")

        # Confirmar todos los cambios
        db.commit()
        logger.info("Todos los cambios guardados exitosamente")

        return {
            "message": "Encuesta completada exitosamente",
            "user_id": current_user.id,
            "perfil_id": perfil.id
        }

    except Exception as e:
        db.rollback()
        logger.error(f"Error al guardar la encuesta: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al guardar la encuesta: {str(e)}"
        )

@router.get("/survey_data", response_model=schemas.SurveyDataResponse)
async def get_survey_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Obtener los datos de la encuesta del usuario actual"""
    try:
        # Obtener el perfil del usuario
        perfil = db.query(models.PerfilUsuario).filter(
            models.PerfilUsuario.id_usuario == current_user.id
        ).first()
        
        if not perfil:
            raise HTTPException(status_code=404, detail="Perfil no encontrado")

        # Obtener preferencias alimentarias
        preferencias = db.query(models.PreferenciasAlimentarias).filter(
            models.PreferenciasAlimentarias.id_perfil == perfil.id
        ).all()
        
        dietas = [p.valor for p in preferencias if p.tipo == 'dieta']
        alergias = [p.valor for p in preferencias if p.tipo == 'alergia']
        alimentos_favoritos = [p.valor for p in preferencias if p.tipo == 'favorito']
        
        # Obtener otros valores
        otros_alergias = next((p.otros_alergias for p in preferencias if p.tipo == 'alergia' and p.otros_alergias), None)
        otros_alimentos_favoritos = next((p.otros_alimentos_favoritos for p in preferencias if p.tipo == 'favorito' and p.otros_alimentos_favoritos), None)

        # Obtener alimentos evitados
        alimentos_evitados = db.query(models.AlimentosEvitados).filter(
            models.AlimentosEvitados.id_perfil == perfil.id
        ).all()
        alimentos_evitados_list = [ae.descripcion for ae in alimentos_evitados]

        # Obtener condición física
        condicion_fisica = db.query(models.CondicionFisica).filter(
            models.CondicionFisica.id_perfil == perfil.id
        ).first()
        
        if condicion_fisica:
            frecuencia_ejercicio = condicion_fisica.frecuencia_ejercicio
            tiempo_disponible = condicion_fisica.tiempo_disponible
        else:
            frecuencia_ejercicio = None
            tiempo_disponible = None

        # Obtener ejercicios preferidos
        ejercicios = db.query(models.EjercicioPreferido).filter(
            models.EjercicioPreferido.id_perfil == perfil.id
        ).all()
        ejercicios_list = [e.tipo for e in ejercicios]

        # Obtener equipamiento disponible
        equipamiento = db.query(models.EquipamientoDisponible).filter(
            models.EquipamientoDisponible.id_perfil == perfil.id
        ).all()
        equipamiento_list = [e.equipo for e in equipamiento]

        # Obtener historial médico
        historial = db.query(models.HistorialMedico).filter(
            models.HistorialMedico.id_perfil == perfil.id
        ).first()
        
        if historial:
            condicion_cronica = historial.condicion_cronica
            medicamentos = historial.medicamentos
            lesiones = historial.lesiones
            antecedentes_familiares = historial.antecedentes_familiares
            otras_condiciones = historial.otras_condiciones
        else:
            condicion_cronica = None
            medicamentos = None
            lesiones = None
            antecedentes_familiares = None
            otras_condiciones = None

        # Obtener hábitos diarios
        habitos = db.query(models.HabitosDiarios).filter(
            models.HabitosDiarios.id_perfil == perfil.id
        ).first()
        
        if habitos:
            horas_sueno = habitos.horas_sueno
            calidad_sueno = habitos.calidad_sueno
            nivel_estres = habitos.nivel_estres
            agua_dia = habitos.agua_dia
            comidas_dia = habitos.comidas_dia
            habitos_snack = habitos.habitos_snack
            horas_pantalla = habitos.horas_pantalla
            tipo_trabajo = habitos.tipo_trabajo
        else:
            horas_sueno = None
            calidad_sueno = None
            nivel_estres = None
            agua_dia = None
            comidas_dia = None
            habitos_snack = None
            horas_pantalla = None
            tipo_trabajo = None

        return {
            "personalInfo": {
                "genero": perfil.genero,
                "edad": perfil.edad,
                "peso": float(perfil.peso) if perfil.peso else None,
                "altura": float(perfil.altura) if perfil.altura else None,
                "nivelActividad": perfil.nivel_actividad
            },
            "goalsObjectives": {
                "objetivoPrincipal": perfil.objetivo_principal,
                "tiempoMeta": perfil.tiempo_meta,
                "nivelCompromiso": perfil.nivel_compromiso,
                "medicionProgreso": perfil.medicion_progreso
            },
            "foodPreferences": {
                "tipoDieta": dietas,
                "alergias": alergias,
                "otrosAlergias": otros_alergias,
                "alimentosFavoritos": alimentos_favoritos,
                "otrosAlimentosFavoritos": otros_alimentos_favoritos,
                "alimentosEvitados": alimentos_evitados_list
            },
            "physicalCondition": {
                "frecuenciaEjercicio": frecuencia_ejercicio,
                "tiempoDisponible": tiempo_disponible,
                "ejerciciosPreferidos": ejercicios_list,
                "equipamientoDisponible": equipamiento_list
            },
            "medicalHistory": {
                "condicionCronica": condicion_cronica,
                "otrasCondiciones": otras_condiciones,
                "medicamentos": medicamentos,
                "lesiones": lesiones,
                "antecedentesFamiliares": antecedentes_familiares
            },
            "dailyHabits": {
                "horasSueno": horas_sueno,
                "calidadSueno": calidad_sueno,
                "nivelEstres": nivel_estres,
                "aguaDia": agua_dia,
                "comidasDia": comidas_dia,
                "habitosSnack": habitos_snack,
                "horasPantalla": horas_pantalla,
                "tipoTrabajo": tipo_trabajo
            }
        }
    except Exception as e:
        logger.error(f"Error al obtener datos de la encuesta: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 