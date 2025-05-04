from typing import List, Optional

from sqlalchemy import DECIMAL, Date, Enum, ForeignKeyConstraint, Index, Integer, String, Text, text
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import datetime
import decimal

class Base(DeclarativeBase):
    pass


class EstadoMeta(Base):
    __tablename__ = 'Estado_Meta'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(50))


class EstadoPlan(Base):
    __tablename__ = 'Estado_Plan'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(50))

    plan_dieta_usuario: Mapped[List['PlanDietaUsuario']] = relationship('PlanDietaUsuario', back_populates='estado_plan')


class EstadoRutina(Base):
    __tablename__ = 'Estado_Rutina'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(50))


class RestriccionUsuario(Base):
    __tablename__ = 'Restriccion_Usuario'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(100))

    perfil_restriccion: Mapped[List['PerfilRestriccion']] = relationship('PerfilRestriccion', back_populates='restriccion_usuario')


class TipoObjetivo(Base):
    __tablename__ = 'Tipo_Objetivo'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(100))

    meta_usuario: Mapped[List['MetaUsuario']] = relationship('MetaUsuario', back_populates='tipo_objetivo')


class TipoUsuario(Base):
    __tablename__ = 'Tipo_Usuario'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(50))

    usuario: Mapped[List['Usuario']] = relationship('Usuario', back_populates='tipo_usuario')


class Usuario(Base):
    __tablename__ = 'Usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_tipo_usuario'], ['Tipo_Usuario.id'], name='usuario_ibfk_1'),
        Index('correo', 'correo', unique=True),
        Index('id_tipo_usuario', 'id_tipo_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100))
    correo: Mapped[str] = mapped_column(String(100))
    contraseña: Mapped[str] = mapped_column(String(100))
    estado: Mapped[Optional[int]] = mapped_column(TINYINT(1), server_default=text("'1'"))
    id_tipo_usuario: Mapped[Optional[int]] = mapped_column(Integer)

    tipo_usuario: Mapped[Optional['TipoUsuario']] = relationship('TipoUsuario', back_populates='usuario')
    meta_usuario: Mapped[List['MetaUsuario']] = relationship('MetaUsuario', back_populates='usuario')
    perfil_usuario: Mapped[List['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='usuario')
    plan_dieta_usuario: Mapped[List['PlanDietaUsuario']] = relationship('PlanDietaUsuario', back_populates='usuario')
    plan_rutina_usuario: Mapped[List['PlanRutinaUsuario']] = relationship('PlanRutinaUsuario', back_populates='usuario')
    progreso_usuario: Mapped[List['ProgresoUsuario']] = relationship('ProgresoUsuario', back_populates='usuario')


class MetaUsuario(Base):
    __tablename__ = 'Meta_Usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_tipo_objetivo'], ['Tipo_Objetivo.id'], name='meta_usuario_ibfk_2'),
        ForeignKeyConstraint(['id_usuario'], ['Usuario.id'], name='meta_usuario_ibfk_1'),
        Index('id_tipo_objetivo', 'id_tipo_objetivo'),
        Index('id_usuario', 'id_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    id_tipo_objetivo: Mapped[Optional[int]] = mapped_column(Integer)

    tipo_objetivo: Mapped[Optional['TipoObjetivo']] = relationship('TipoObjetivo', back_populates='meta_usuario')
    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='meta_usuario')
    seguimiento_meta: Mapped[List['SeguimientoMeta']] = relationship('SeguimientoMeta', back_populates='meta_usuario')


class PerfilUsuario(Base):
    __tablename__ = 'Perfil_Usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_usuario'], ['Usuario.id'], name='perfil_usuario_ibfk_1'),
        Index('id_usuario', 'id_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    genero: Mapped[Optional[str]] = mapped_column(Enum('masculino', 'femenino', 'otro', 'prefiero_no_decir'))
    edad: Mapped[Optional[int]] = mapped_column(Integer)
    peso: Mapped[Optional[decimal.Decimal]] = mapped_column(DECIMAL(5, 2))
    altura: Mapped[Optional[decimal.Decimal]] = mapped_column(DECIMAL(5, 2))
    nivel_actividad: Mapped[Optional[str]] = mapped_column(Enum('sedentario', 'moderado', 'activo', 'muy_activo', 'extremo'))
    objetivo_principal: Mapped[Optional[str]] = mapped_column(String(50))
    tiempo_meta: Mapped[Optional[str]] = mapped_column(String(20))
    nivel_compromiso: Mapped[Optional[int]] = mapped_column(TINYINT)
    medicion_progreso: Mapped[Optional[str]] = mapped_column(String(255))
    id_usuario: Mapped[Optional[int]] = mapped_column(Integer)

    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='perfil_usuario')
    alimentos_evitados: Mapped[List['AlimentosEvitados']] = relationship('AlimentosEvitados', back_populates='perfil_usuario')
    condicion_fisica: Mapped[List['CondicionFisica']] = relationship('CondicionFisica', back_populates='perfil_usuario')
    ejercicio_preferido: Mapped[List['EjercicioPreferido']] = relationship('EjercicioPreferido', back_populates='perfil_usuario')
    equipamiento_disponible: Mapped[List['EquipamientoDisponible']] = relationship('EquipamientoDisponible', back_populates='perfil_usuario')
    habitos_diarios: Mapped[List['HabitosDiarios']] = relationship('HabitosDiarios', back_populates='perfil_usuario')
    historial_medico: Mapped[List['HistorialMedico']] = relationship('HistorialMedico', back_populates='perfil_usuario')
    perfil_restriccion: Mapped[List['PerfilRestriccion']] = relationship('PerfilRestriccion', back_populates='perfil_usuario')
    preferencias_alimentarias: Mapped[List['PreferenciasAlimentarias']] = relationship('PreferenciasAlimentarias', back_populates='perfil_usuario')


class PlanDietaUsuario(Base):
    __tablename__ = 'Plan_Dieta_Usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_estado_plan'], ['Estado_Plan.id'], name='plan_dieta_usuario_ibfk_2'),
        ForeignKeyConstraint(['id_usuario'], ['Usuario.id'], name='plan_dieta_usuario_ibfk_1'),
        Index('id_estado_plan', 'id_estado_plan'),
        Index('id_usuario', 'id_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    id_estado_plan: Mapped[Optional[int]] = mapped_column(Integer)

    estado_plan: Mapped[Optional['EstadoPlan']] = relationship('EstadoPlan', back_populates='plan_dieta_usuario')
    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='plan_dieta_usuario')
    seguimiento_dieta: Mapped[List['SeguimientoDieta']] = relationship('SeguimientoDieta', back_populates='plan_dieta_usuario')
    plan_comidas_diario: Mapped[List['PlanComidasDiario']] = relationship('PlanComidasDiario', back_populates='plan_dieta_usuario')


class PlanRutinaUsuario(Base):
    __tablename__ = 'Plan_Rutina_Usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_usuario'], ['Usuario.id'], name='plan_rutina_usuario_ibfk_1'),
        Index('id_usuario', 'id_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    id_estado_plan: Mapped[Optional[int]] = mapped_column(Integer)

    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='plan_rutina_usuario')
    seguimiento_rutina: Mapped[List['SeguimientoRutina']] = relationship('SeguimientoRutina', back_populates='plan_rutina_usuario')
    plan_entrenamiento_diario: Mapped[List['PlanEntrenamientoDiario']] = relationship('PlanEntrenamientoDiario', back_populates='plan_rutina_usuario')


class ProgresoUsuario(Base):
    __tablename__ = 'Progreso_Usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_usuario'], ['Usuario.id'], name='progreso_usuario_ibfk_1'),
        Index('id_usuario', 'id_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    descripcion: Mapped[Optional[str]] = mapped_column(Text)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)

    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='progreso_usuario')


class AlimentosEvitados(Base):
    __tablename__ = 'Alimentos_Evitados'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['Perfil_Usuario.id'], name='alimentos_evitados_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    descripcion: Mapped[Optional[str]] = mapped_column(Text)

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='alimentos_evitados')


class CondicionFisica(Base):
    __tablename__ = 'Condicion_Fisica'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['Perfil_Usuario.id'], name='condicion_fisica_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    frecuencia_ejercicio: Mapped[Optional[str]] = mapped_column(String(50))
    tiempo_disponible: Mapped[Optional[str]] = mapped_column(String(50))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='condicion_fisica')


class EjercicioPreferido(Base):
    __tablename__ = 'Ejercicio_Preferido'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['Perfil_Usuario.id'], name='ejercicio_preferido_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    tipo: Mapped[Optional[str]] = mapped_column(String(50))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='ejercicio_preferido')


class EquipamientoDisponible(Base):
    __tablename__ = 'Equipamiento_Disponible'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['Perfil_Usuario.id'], name='equipamiento_disponible_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    equipo: Mapped[Optional[str]] = mapped_column(String(50))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='equipamiento_disponible')


class HabitosDiarios(Base):
    __tablename__ = 'Habitos_Diarios'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['Perfil_Usuario.id'], name='habitos_diarios_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    horas_sueno: Mapped[Optional[str]] = mapped_column(String(20))
    calidad_sueno: Mapped[Optional[str]] = mapped_column(String(20))
    nivel_estres: Mapped[Optional[str]] = mapped_column(String(20))
    agua_dia: Mapped[Optional[str]] = mapped_column(String(20))
    comidas_dia: Mapped[Optional[str]] = mapped_column(String(20))
    habitos_snack: Mapped[Optional[str]] = mapped_column(String(30))
    horas_pantalla: Mapped[Optional[str]] = mapped_column(String(20))
    tipo_trabajo: Mapped[Optional[str]] = mapped_column(String(30))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='habitos_diarios')


class HistorialMedico(Base):
    __tablename__ = 'Historial_Medico'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['Perfil_Usuario.id'], name='historial_medico_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    condicion_cronica: Mapped[Optional[str]] = mapped_column(Text)
    medicamentos: Mapped[Optional[str]] = mapped_column(Text)
    lesiones: Mapped[Optional[str]] = mapped_column(Text)
    antecedentes_familiares: Mapped[Optional[str]] = mapped_column(Text)
    otras_condiciones: Mapped[Optional[str]] = mapped_column(Text)

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='historial_medico')


class PerfilRestriccion(Base):
    __tablename__ = 'Perfil_Restriccion'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['Perfil_Usuario.id'], name='perfil_restriccion_ibfk_1'),
        ForeignKeyConstraint(['id_restriccion'], ['Restriccion_Usuario.id'], name='perfil_restriccion_ibfk_2'),
        Index('id_perfil', 'id_perfil'),
        Index('id_restriccion', 'id_restriccion')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    id_restriccion: Mapped[Optional[int]] = mapped_column(Integer)

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='perfil_restriccion')
    restriccion_usuario: Mapped[Optional['RestriccionUsuario']] = relationship('RestriccionUsuario', back_populates='perfil_restriccion')


class PreferenciasAlimentarias(Base):
    __tablename__ = 'Preferencias_Alimentarias'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['Perfil_Usuario.id'], name='preferencias_alimentarias_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    tipo: Mapped[Optional[str]] = mapped_column(Enum('dieta', 'alergia', 'favorito'))
    valor: Mapped[Optional[str]] = mapped_column(String(100))
    otros_alergias: Mapped[Optional[str]] = mapped_column(String(255))
    otros_alimentos_favoritos: Mapped[Optional[str]] = mapped_column(String(255))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='preferencias_alimentarias')


class SeguimientoDieta(Base):
    __tablename__ = 'Seguimiento_Dieta'
    __table_args__ = (
        ForeignKeyConstraint(['id_plan_dieta'], ['Plan_Dieta_Usuario.id'], name='seguimiento_dieta_ibfk_1'),
        Index('id_plan_dieta', 'id_plan_dieta')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_plan_dieta: Mapped[Optional[int]] = mapped_column(Integer)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)
    descripcion: Mapped[Optional[str]] = mapped_column(Text)

    plan_dieta_usuario: Mapped[Optional['PlanDietaUsuario']] = relationship('PlanDietaUsuario', back_populates='seguimiento_dieta')


class SeguimientoMeta(Base):
    __tablename__ = 'Seguimiento_Meta'
    __table_args__ = (
        ForeignKeyConstraint(['id_meta_usuario'], ['Meta_Usuario.id'], name='seguimiento_meta_ibfk_1'),
        Index('id_meta_usuario', 'id_meta_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_meta_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)
    avance: Mapped[Optional[str]] = mapped_column(Text)

    meta_usuario: Mapped[Optional['MetaUsuario']] = relationship('MetaUsuario', back_populates='seguimiento_meta')


class SeguimientoRutina(Base):
    __tablename__ = 'Seguimiento_Rutina'
    __table_args__ = (
        ForeignKeyConstraint(['id_plan_rutina'], ['Plan_Rutina_Usuario.id'], name='seguimiento_rutina_ibfk_1'),
        Index('id_plan_rutina', 'id_plan_rutina')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_plan_rutina: Mapped[Optional[int]] = mapped_column(Integer)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)
    comentarios: Mapped[Optional[str]] = mapped_column(Text)

    plan_rutina_usuario: Mapped[Optional['PlanRutinaUsuario']] = relationship('PlanRutinaUsuario', back_populates='seguimiento_rutina')


class PlanEntrenamientoDiario(Base):
    __tablename__ = 'Plan_Entrenamiento_Diario'
    __table_args__ = (
        ForeignKeyConstraint(['id_plan_rutina'], ['Plan_Rutina_Usuario.id'], name='plan_entrenamiento_diario_ibfk_1'),
        Index('idx_plan_rutina', 'id_plan_rutina')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_plan_rutina: Mapped[Optional[int]] = mapped_column(Integer)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)
    tipo_dia: Mapped[Optional[str]] = mapped_column(String(20))

    plan_rutina_usuario: Mapped[Optional['PlanRutinaUsuario']] = relationship('PlanRutinaUsuario', back_populates='plan_entrenamiento_diario')
    detalles_entrenamiento: Mapped[List['DetallePlanEntrenamiento']] = relationship('DetallePlanEntrenamiento', back_populates='plan_entrenamiento_diario')


class DetallePlanEntrenamiento(Base):
    __tablename__ = 'Detalle_Plan_Entrenamiento'
    __table_args__ = (
        ForeignKeyConstraint(['id_plan_diario'], ['Plan_Entrenamiento_Diario.id'], name='detalle_plan_entrenamiento_ibfk_1'),
        Index('idx_plan_diario', 'id_plan_diario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_plan_diario: Mapped[Optional[int]] = mapped_column(Integer)
    deporte: Mapped[Optional[str]] = mapped_column(String(50))
    ejercicio: Mapped[Optional[str]] = mapped_column(String(100))
    repeticiones: Mapped[Optional[int]] = mapped_column(Integer)
    series: Mapped[Optional[int]] = mapped_column(Integer)

    plan_entrenamiento_diario: Mapped[Optional['PlanEntrenamientoDiario']] = relationship('PlanEntrenamientoDiario', back_populates='detalles_entrenamiento')


class PlanComidasDiario(Base):
    __tablename__ = 'Plan_Comidas_Diario'
    __table_args__ = (
        ForeignKeyConstraint(['id_plan_dieta'], ['Plan_Dieta_Usuario.id'], name='plan_comidas_diario_ibfk_1'),
        Index('idx_plan_dieta', 'id_plan_dieta')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_plan_dieta: Mapped[Optional[int]] = mapped_column(Integer)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)

    plan_dieta_usuario: Mapped[Optional['PlanDietaUsuario']] = relationship('PlanDietaUsuario', back_populates='plan_comidas_diario')
    detalles_comidas: Mapped[List['DetallePlanComidas']] = relationship('DetallePlanComidas', back_populates='plan_comidas_diario')


class DetallePlanComidas(Base):
    __tablename__ = 'Detalle_Plan_Comidas'
    __table_args__ = (
        ForeignKeyConstraint(['id_plan_diario'], ['Plan_Comidas_Diario.id'], name='detalle_plan_comidas_ibfk_1'),
        Index('idx_plan_diario', 'id_plan_diario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_plan_diario: Mapped[Optional[int]] = mapped_column(Integer)
    tipo_comida: Mapped[Optional[str]] = mapped_column(String(50))
    plato: Mapped[Optional[str]] = mapped_column(String(255))
    proteinas: Mapped[Optional[decimal.Decimal]] = mapped_column(DECIMAL(5, 2))
    grasas: Mapped[Optional[decimal.Decimal]] = mapped_column(DECIMAL(5, 2))
    carbohidratos: Mapped[Optional[decimal.Decimal]] = mapped_column(DECIMAL(5, 2))
    calorias: Mapped[Optional[decimal.Decimal]] = mapped_column(DECIMAL(6, 2))

    plan_comidas_diario: Mapped[Optional['PlanComidasDiario']] = relationship('PlanComidasDiario', back_populates='detalles_comidas')
