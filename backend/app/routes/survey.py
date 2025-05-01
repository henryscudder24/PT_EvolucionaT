from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from ..database import get_db
from ..models import models_auto as models
from ..schemas import survey as schemas
from ..auth import get_current_user

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/survey/complete", response_model=dict)
async def complete_survey(
    survey_data: schemas.SurveyData,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    try:
        logger.info(f"Recibiendo datos de encuesta para usuario {current_user.id}")
        logger.info(f"Datos recibidos: {survey_data.model_dump_json()}")
        
        # Validar que el usuario existe y está activo
        if not current_user.estado:
            raise HTTPException(
                status_code=400,
                detail="Usuario inactivo"
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
                nivel_compromiso=survey_data.goalsObjectives.nivelCompromiso
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
        logger.info(f"Tipos de dieta: {survey_data.foodPreferences.tipoDieta}")
        
        # Validar y guardar tipo de dieta
        for tipo in survey_data.foodPreferences.tipoDieta:
            preferencia = models.PreferenciasAlimentarias(
                id_perfil=perfil.id,
                tipo='dieta',
                valor=tipo
            )
            db.add(preferencia)
            logger.info(f"Agregada preferencia de dieta: {tipo}")

        # Validar y guardar alergias
        for alergia in survey_data.foodPreferences.alergias:
            if len(alergia) > 100:
                raise HTTPException(
                    status_code=400,
                    detail=f"La alergia '{alergia}' excede el límite de 100 caracteres"
                )
            preferencia = models.PreferenciasAlimentarias(
                id_perfil=perfil.id,
                tipo='alergia',
                valor=alergia
            )
            db.add(preferencia)
            logger.info(f"Agregada alergia: {alergia}")

        # Validar y guardar alimentos favoritos
        for favorito in survey_data.foodPreferences.alimentosFavoritos:
            if len(favorito) > 100:
                raise HTTPException(
                    status_code=400,
                    detail=f"El alimento favorito '{favorito}' excede el límite de 100 caracteres"
                )
            preferencia = models.PreferenciasAlimentarias(
                id_perfil=perfil.id,
                tipo='favorito',
                valor=favorito
            )
            db.add(preferencia)
            logger.info(f"Agregado alimento favorito: {favorito}")

        # 4. Guardar alimentos evitados
        if survey_data.foodPreferences.alimentosEvitar:
            alimentos_evitados = models.AlimentosEvitados(
                id_perfil=perfil.id,
                descripcion=survey_data.foodPreferences.alimentosEvitar
            )
            db.add(alimentos_evitados)
            logger.info(f"Agregados alimentos evitados: {survey_data.foodPreferences.alimentosEvitar}")

        # 5. Guardar condición física
        logger.info("Guardando condición física")
        condicion = models.CondicionFisica(
            id_perfil=perfil.id,
            frecuencia_ejercicio=survey_data.fitnessLevel.frecuenciaEjercicio,
            tiempo_disponible=survey_data.fitnessLevel.tiempoEjercicio
        )
        db.add(condicion)
        logger.info("Condición física guardada exitosamente")

        # 6. Guardar ejercicios preferidos
        for ejercicio in survey_data.fitnessLevel.tiposEjercicio:
            if len(ejercicio) > 50:
                raise HTTPException(
                    status_code=400,
                    detail=f"El tipo de ejercicio '{ejercicio}' excede el límite de 50 caracteres"
                )
            ejercicio_pref = models.EjercicioPreferido(
                id_perfil=perfil.id,
                tipo=ejercicio
            )
            db.add(ejercicio_pref)
            logger.info(f"Agregado ejercicio preferido: {ejercicio}")

        # 7. Guardar equipamiento disponible
        for equipo in survey_data.fitnessLevel.equipamiento:
            if len(equipo) > 50:
                raise HTTPException(
                    status_code=400,
                    detail=f"El equipo '{equipo}' excede el límite de 50 caracteres"
                )
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
            condicion_cronica=','.join(survey_data.medicalHistory.condicionesCronicas),
            medicamentos=survey_data.medicalHistory.medicamentos,
            lesiones=survey_data.medicalHistory.lesionesRecientes,
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
            agua_dia=survey_data.dailyHabits.consumoAgua,
            comidas_dia=survey_data.dailyHabits.comidasPorDia,
            habitos_snack=survey_data.dailyHabits.habitosSnacks,
            horas_pantalla=survey_data.dailyHabits.horasPantallas,
            tipo_trabajo=survey_data.dailyHabits.tipoTrabajo
        )
        db.add(habitos)
        logger.info("Hábitos diarios guardados exitosamente")

        # Guardar todos los cambios
        logger.info("Guardando todos los cambios en la base de datos")
        db.commit()
        logger.info("Encuesta completada exitosamente")

        return {"message": "Encuesta completada exitosamente"}

    except Exception as e:
        logger.error(f"Error al guardar la encuesta: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al guardar los datos de la encuesta: {str(e)}"
        ) 