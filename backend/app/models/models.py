from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    perfil = relationship("PerfilUsuario", back_populates="usuario", uselist=False)

class PerfilUsuario(Base):
    __tablename__ = "perfiles_usuario"

    id = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id"))
    genero = Column(String)
    edad = Column(Integer)
    altura = Column(Integer)
    peso = Column(Integer)
    nivel_actividad = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    usuario = relationship("Usuario", back_populates="perfil")
    preferencias = relationship("PreferenciasAlimentarias", back_populates="perfil", uselist=False)
    objetivos = relationship("MetasObjetivos", back_populates="perfil", uselist=False)
    fitness = relationship("CondicionFisica", back_populates="perfil", uselist=False)
    historial = relationship("HistorialMedico", back_populates="perfil", uselist=False)
    habitos = relationship("HabitosDiarios", back_populates="perfil", uselist=False)

class PreferenciasAlimentarias(Base):
    __tablename__ = "preferencias_alimentarias"

    id = Column(Integer, primary_key=True, index=True)
    id_perfil = Column(Integer, ForeignKey("perfiles_usuario.id"))
    tipo_dieta = Column(String)
    alergias = Column(String)
    otros_alergias = Column(Text, nullable=True)
    alimentos_favoritos = Column(String)
    alimentos_evitar = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    perfil = relationship("PerfilUsuario", back_populates="preferencias")

class MetasObjetivos(Base):
    __tablename__ = "metas_objetivos"

    id = Column(Integer, primary_key=True, index=True)
    id_perfil = Column(Integer, ForeignKey("perfiles_usuario.id"))
    objetivo_principal = Column(String)
    tiempo_meta = Column(String)
    nivel_compromiso = Column(Integer)
    medicion_progreso = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    perfil = relationship("PerfilUsuario", back_populates="objetivos")

class CondicionFisica(Base):
    __tablename__ = "condicion_fisica"

    id = Column(Integer, primary_key=True, index=True)
    id_perfil = Column(Integer, ForeignKey("perfiles_usuario.id"))
    frecuencia_ejercicio = Column(String)
    tipos_ejercicio = Column(String)
    equipamiento = Column(String)
    tiempo_ejercicio = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    perfil = relationship("PerfilUsuario", back_populates="fitness")

class HistorialMedico(Base):
    __tablename__ = "historial_medico"

    id = Column(Integer, primary_key=True, index=True)
    id_perfil = Column(Integer, ForeignKey("perfiles_usuario.id"))
    condiciones_cronicas = Column(String)
    otras_condiciones = Column(Text, nullable=True)
    medicamentos = Column(Text, nullable=True)
    lesiones_recientes = Column(Text, nullable=True)
    antecedentes_familiares = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    perfil = relationship("PerfilUsuario", back_populates="historial")

class HabitosDiarios(Base):
    __tablename__ = "habitos_diarios"

    id = Column(Integer, primary_key=True, index=True)
    id_perfil = Column(Integer, ForeignKey("perfiles_usuario.id"))
    horas_sueno = Column(String)
    calidad_sueno = Column(String)
    nivel_estres = Column(String)
    agua_dia = Column(String)
    comidas_dia = Column(String)
    habitos_snack = Column(String)
    horas_pantalla = Column(String)
    tipo_trabajo = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    perfil = relationship("PerfilUsuario", back_populates="habitos") 