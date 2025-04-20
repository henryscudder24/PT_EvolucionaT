from typing import List, Optional

from sqlalchemy import DECIMAL, Date, Enum, ForeignKeyConstraint, Index, Integer, String, Text, text
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import datetime
import decimal

class Base(DeclarativeBase):
    pass


class EstadoMeta(Base):
    __tablename__ = 'estado_meta'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(50))


class EstadoPlan(Base):
    __tablename__ = 'estado_plan'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(50))

    plan_dieta_usuario: Mapped[List['PlanDietaUsuario']] = relationship('PlanDietaUsuario', back_populates='estado_plan')


class EstadoRutina(Base):
    __tablename__ = 'estado_rutina'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(50))


class RestriccionUsuario(Base):
    __tablename__ = 'restriccion_usuario'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(100))

    perfil_restriccion: Mapped[List['PerfilRestriccion']] = relationship('PerfilRestriccion', back_populates='restriccion_usuario')


class TipoObjetivo(Base):
    __tablename__ = 'tipo_objetivo'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(100))

    meta_usuario: Mapped[List['MetaUsuario']] = relationship('MetaUsuario', back_populates='tipo_objetivo')


class TipoUsuario(Base):
    __tablename__ = 'tipo_usuario'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(50))

    usuario: Mapped[List['Usuario']] = relationship('Usuario', back_populates='tipo_usuario')


class Usuario(Base):
    __tablename__ = 'usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_tipo_usuario'], ['tipo_usuario.id'], name='usuario_ibfk_1'),
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
    __tablename__ = 'meta_usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_tipo_objetivo'], ['tipo_objetivo.id'], name='meta_usuario_ibfk_2'),
        ForeignKeyConstraint(['id_usuario'], ['usuario.id'], name='meta_usuario_ibfk_1'),
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
    __tablename__ = 'perfil_usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_usuario'], ['usuario.id'], name='perfil_usuario_ibfk_1'),
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
    __tablename__ = 'plan_dieta_usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_estado_plan'], ['estado_plan.id'], name='plan_dieta_usuario_ibfk_2'),
        ForeignKeyConstraint(['id_usuario'], ['usuario.id'], name='plan_dieta_usuario_ibfk_1'),
        Index('id_estado_plan', 'id_estado_plan'),
        Index('id_usuario', 'id_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    id_estado_plan: Mapped[Optional[int]] = mapped_column(Integer)

    estado_plan: Mapped[Optional['EstadoPlan']] = relationship('EstadoPlan', back_populates='plan_dieta_usuario')
    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='plan_dieta_usuario')
    seguimiento_dieta: Mapped[List['SeguimientoDieta']] = relationship('SeguimientoDieta', back_populates='plan_dieta_usuario')


class PlanRutinaUsuario(Base):
    __tablename__ = 'plan_rutina_usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_usuario'], ['usuario.id'], name='plan_rutina_usuario_ibfk_1'),
        Index('id_usuario', 'id_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    id_estado_plan: Mapped[Optional[int]] = mapped_column(Integer)

    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='plan_rutina_usuario')
    seguimiento_rutina: Mapped[List['SeguimientoRutina']] = relationship('SeguimientoRutina', back_populates='plan_rutina_usuario')


class ProgresoUsuario(Base):
    __tablename__ = 'progreso_usuario'
    __table_args__ = (
        ForeignKeyConstraint(['id_usuario'], ['usuario.id'], name='progreso_usuario_ibfk_1'),
        Index('id_usuario', 'id_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    descripcion: Mapped[Optional[str]] = mapped_column(Text)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)

    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='progreso_usuario')


class AlimentosEvitados(Base):
    __tablename__ = 'alimentos_evitados'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['perfil_usuario.id'], name='alimentos_evitados_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    descripcion: Mapped[Optional[str]] = mapped_column(Text)

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='alimentos_evitados')


class CondicionFisica(Base):
    __tablename__ = 'condicion_fisica'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['perfil_usuario.id'], name='condicion_fisica_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    frecuencia_ejercicio: Mapped[Optional[str]] = mapped_column(String(50))
    tiempo_disponible: Mapped[Optional[str]] = mapped_column(String(50))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='condicion_fisica')


class EjercicioPreferido(Base):
    __tablename__ = 'ejercicio_preferido'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['perfil_usuario.id'], name='ejercicio_preferido_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    tipo: Mapped[Optional[str]] = mapped_column(String(50))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='ejercicio_preferido')


class EquipamientoDisponible(Base):
    __tablename__ = 'equipamiento_disponible'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['perfil_usuario.id'], name='equipamiento_disponible_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    equipo: Mapped[Optional[str]] = mapped_column(String(50))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='equipamiento_disponible')


class HabitosDiarios(Base):
    __tablename__ = 'habitos_diarios'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['perfil_usuario.id'], name='habitos_diarios_ibfk_1'),
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
    __tablename__ = 'historial_medico'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['perfil_usuario.id'], name='historial_medico_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    condicion_cronica: Mapped[Optional[str]] = mapped_column(Text)
    medicamentos: Mapped[Optional[str]] = mapped_column(Text)
    lesiones: Mapped[Optional[str]] = mapped_column(Text)
    antecedentes_familiares: Mapped[Optional[str]] = mapped_column(Text)

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='historial_medico')


class PerfilRestriccion(Base):
    __tablename__ = 'perfil_restriccion'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['perfil_usuario.id'], name='perfil_restriccion_ibfk_1'),
        ForeignKeyConstraint(['id_restriccion'], ['restriccion_usuario.id'], name='perfil_restriccion_ibfk_2'),
        Index('id_perfil', 'id_perfil'),
        Index('id_restriccion', 'id_restriccion')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    id_restriccion: Mapped[Optional[int]] = mapped_column(Integer)

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='perfil_restriccion')
    restriccion_usuario: Mapped[Optional['RestriccionUsuario']] = relationship('RestriccionUsuario', back_populates='perfil_restriccion')


class PreferenciasAlimentarias(Base):
    __tablename__ = 'preferencias_alimentarias'
    __table_args__ = (
        ForeignKeyConstraint(['id_perfil'], ['perfil_usuario.id'], name='preferencias_alimentarias_ibfk_1'),
        Index('id_perfil', 'id_perfil')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[Optional[int]] = mapped_column(Integer)
    tipo: Mapped[Optional[str]] = mapped_column(Enum('dieta', 'alergia', 'favorito'))
    valor: Mapped[Optional[str]] = mapped_column(String(100))

    perfil_usuario: Mapped[Optional['PerfilUsuario']] = relationship('PerfilUsuario', back_populates='preferencias_alimentarias')


class SeguimientoDieta(Base):
    __tablename__ = 'seguimiento_dieta'
    __table_args__ = (
        ForeignKeyConstraint(['id_plan_dieta'], ['plan_dieta_usuario.id'], name='seguimiento_dieta_ibfk_1'),
        Index('id_plan_dieta', 'id_plan_dieta')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_plan_dieta: Mapped[Optional[int]] = mapped_column(Integer)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)
    descripcion: Mapped[Optional[str]] = mapped_column(Text)

    plan_dieta_usuario: Mapped[Optional['PlanDietaUsuario']] = relationship('PlanDietaUsuario', back_populates='seguimiento_dieta')


class SeguimientoMeta(Base):
    __tablename__ = 'seguimiento_meta'
    __table_args__ = (
        ForeignKeyConstraint(['id_meta_usuario'], ['meta_usuario.id'], name='seguimiento_meta_ibfk_1'),
        Index('id_meta_usuario', 'id_meta_usuario')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_meta_usuario: Mapped[Optional[int]] = mapped_column(Integer)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)
    avance: Mapped[Optional[str]] = mapped_column(Text)

    meta_usuario: Mapped[Optional['MetaUsuario']] = relationship('MetaUsuario', back_populates='seguimiento_meta')


class SeguimientoRutina(Base):
    __tablename__ = 'seguimiento_rutina'
    __table_args__ = (
        ForeignKeyConstraint(['id_plan_rutina'], ['plan_rutina_usuario.id'], name='seguimiento_rutina_ibfk_1'),
        Index('id_plan_rutina', 'id_plan_rutina')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_plan_rutina: Mapped[Optional[int]] = mapped_column(Integer)
    fecha: Mapped[Optional[datetime.date]] = mapped_column(Date)
    comentarios: Mapped[Optional[str]] = mapped_column(Text)

    plan_rutina_usuario: Mapped[Optional['PlanRutinaUsuario']] = relationship('PlanRutinaUsuario', back_populates='seguimiento_rutina')
