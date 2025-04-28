from sqlalchemy import Boolean, Column, Integer, String, Text, Date, Enum, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
import decimal

Base = declarative_base()

class Tipo_Usuario(Base):
    __tablename__ = 'Tipo_Usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(50))

    usuarios = relationship("Usuario", back_populates="tipo_usuario")

class Usuario(Base):
    __tablename__ = 'Usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), nullable=False, unique=True)
    contraseña = Column(String(100), nullable=False)
    estado = Column(Boolean, default=True)
    id_tipo_usuario = Column(Integer, ForeignKey('Tipo_Usuario.id'))

    tipo_usuario = relationship("Tipo_Usuario", back_populates="usuarios")
    perfil = relationship("Perfil_Usuario", back_populates="usuario", uselist=False)
    metas = relationship("Meta_Usuario", back_populates="usuario")
    progresos = relationship("Progreso_Usuario", back_populates="usuario")
    planes_rutina = relationship("Plan_Rutina_Usuario", back_populates="usuario")
    planes_dieta = relationship("Plan_Dieta_Usuario", back_populates="usuario")

class Perfil_Usuario(Base):
    __tablename__ = 'Perfil_Usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    genero = Column(Enum('masculino', 'femenino', 'otro', 'prefiero_no_decir'))
    edad = Column(Integer)
    peso = Column(DECIMAL(5,2))
    altura = Column(DECIMAL(5,2))
    nivel_actividad = Column(Enum('sedentario', 'moderado', 'activo', 'muy_activo', 'extremo'))
    objetivo_principal = Column(String(50))
    tiempo_meta = Column(String(20))
    nivel_compromiso = Column(Integer)
    id_usuario = Column(Integer, ForeignKey('Usuario.id'))

    usuario = relationship("Usuario", back_populates="perfil")
    preferencias_alimentarias = relationship("Preferencias_Alimentarias", back_populates="perfil")
    alimentos_evitados = relationship("Alimentos_Evitados", back_populates="perfil")
    condicion_fisica = relationship("Condicion_Fisica", back_populates="perfil")
    ejercicio_preferido = relationship("Ejercicio_Preferido", back_populates="perfil")
    equipamiento_disponible = relationship("Equipamiento_Disponible", back_populates="perfil")
    historial_medico = relationship("Historial_Medico", back_populates="perfil")
    habitos_diarios = relationship("Habitos_Diarios", back_populates="perfil")
    perfil_restricciones = relationship("Perfil_Restriccion", back_populates="perfil")

class Preferencias_Alimentarias(Base):
    __tablename__ = 'Preferencias_Alimentarias'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_perfil = Column(Integer, ForeignKey('Perfil_Usuario.id'))
    tipo = Column(Enum('dieta', 'alergia', 'favorito'))
    valor = Column(String(100))

    perfil = relationship("Perfil_Usuario", back_populates="preferencias_alimentarias")

class Alimentos_Evitados(Base):
    __tablename__ = 'Alimentos_Evitados'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_perfil = Column(Integer, ForeignKey('Perfil_Usuario.id'))
    descripcion = Column(Text)

    perfil = relationship("Perfil_Usuario", back_populates="alimentos_evitados")

class Condicion_Fisica(Base):
    __tablename__ = 'Condicion_Fisica'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_perfil = Column(Integer, ForeignKey('Perfil_Usuario.id'))
    frecuencia_ejercicio = Column(String(50))
    tiempo_disponible = Column(String(50))

    perfil = relationship("Perfil_Usuario", back_populates="condicion_fisica")

class Ejercicio_Preferido(Base):
    __tablename__ = 'Ejercicio_Preferido'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_perfil = Column(Integer, ForeignKey('Perfil_Usuario.id'))
    tipo = Column(String(50))

    perfil = relationship("Perfil_Usuario", back_populates="ejercicio_preferido")

class Equipamiento_Disponible(Base):
    __tablename__ = 'Equipamiento_Disponible'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_perfil = Column(Integer, ForeignKey('Perfil_Usuario.id'))
    equipo = Column(String(50))

    perfil = relationship("Perfil_Usuario", back_populates="equipamiento_disponible")

class Historial_Medico(Base):
    __tablename__ = 'Historial_Medico'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_perfil = Column(Integer, ForeignKey('Perfil_Usuario.id'))
    condicion_cronica = Column(Text)
    medicamentos = Column(Text)
    lesiones = Column(Text)
    antecedentes_familiares = Column(Text)

    perfil = relationship("Perfil_Usuario", back_populates="historial_medico")

class Habitos_Diarios(Base):
    __tablename__ = 'Habitos_Diarios'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_perfil = Column(Integer, ForeignKey('Perfil_Usuario.id'))
    horas_sueno = Column(String(20))
    calidad_sueno = Column(String(20))
    nivel_estres = Column(String(20))
    agua_dia = Column(String(20))
    comidas_dia = Column(String(20))
    habitos_snack = Column(String(30))
    horas_pantalla = Column(String(20))
    tipo_trabajo = Column(String(30))

    perfil = relationship("Perfil_Usuario", back_populates="habitos_diarios")

class Restriccion_Usuario(Base):
    __tablename__ = 'Restriccion_Usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(100))

    perfil_restricciones = relationship("Perfil_Restriccion", back_populates="restriccion")

class Perfil_Restriccion(Base):
    __tablename__ = 'Perfil_Restriccion'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_perfil = Column(Integer, ForeignKey('Perfil_Usuario.id'))
    id_restriccion = Column(Integer, ForeignKey('Restriccion_Usuario.id'))

    perfil = relationship("Perfil_Usuario", back_populates="perfil_restricciones")
    restriccion = relationship("Restriccion_Usuario", back_populates="perfil_restricciones")

class Tipo_Objetivo(Base):
    __tablename__ = 'Tipo_Objetivo'

    id = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(100))

    metas = relationship("Meta_Usuario", back_populates="tipo_objetivo")

class Meta_Usuario(Base):
    __tablename__ = 'Meta_Usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('Usuario.id'))
    id_tipo_objetivo = Column(Integer, ForeignKey('Tipo_Objetivo.id'))

    usuario = relationship("Usuario", back_populates="metas")
    tipo_objetivo = relationship("Tipo_Objetivo", back_populates="metas")
    seguimientos = relationship("Seguimiento_Meta", back_populates="meta")

class Estado_Meta(Base):
    __tablename__ = 'Estado_Meta'

    id = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(50))

class Seguimiento_Meta(Base):
    __tablename__ = 'Seguimiento_Meta'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_meta_usuario = Column(Integer, ForeignKey('Meta_Usuario.id'))
    fecha = Column(Date)
    avance = Column(Text)

    meta = relationship("Meta_Usuario", back_populates="seguimientos")

class Progreso_Usuario(Base):
    __tablename__ = 'Progreso_Usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('Usuario.id'))
    descripcion = Column(Text)
    fecha = Column(Date)

    usuario = relationship("Usuario", back_populates="progresos")

class Plan_Rutina_Usuario(Base):
    __tablename__ = 'Plan_Rutina_Usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('Usuario.id'))
    id_estado_plan = Column(Integer, ForeignKey('Estado_Rutina.id'))

    usuario = relationship("Usuario", back_populates="planes_rutina")
    estado = relationship("Estado_Rutina", back_populates="planes_rutina")
    seguimientos = relationship("Seguimiento_Rutina", back_populates="plan_rutina")

class Estado_Rutina(Base):
    __tablename__ = 'Estado_Rutina'

    id = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(50))

    planes_rutina = relationship("Plan_Rutina_Usuario", back_populates="estado")

class Seguimiento_Rutina(Base):
    __tablename__ = 'Seguimiento_Rutina'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_plan_rutina = Column(Integer, ForeignKey('Plan_Rutina_Usuario.id'))
    fecha = Column(Date)
    comentarios = Column(Text)

    plan_rutina = relationship("Plan_Rutina_Usuario", back_populates="seguimientos")

class Estado_Plan(Base):
    __tablename__ = 'Estado_Plan'

    id = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(50))

    planes_dieta = relationship("Plan_Dieta_Usuario", back_populates="estado")

class Plan_Dieta_Usuario(Base):
    __tablename__ = 'Plan_Dieta_Usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('Usuario.id'))
    id_estado_plan = Column(Integer, ForeignKey('Estado_Plan.id'))

    usuario = relationship("Usuario", back_populates="planes_dieta")
    estado = relationship("Estado_Plan", back_populates="planes_dieta")
    seguimientos = relationship("Seguimiento_Dieta", back_populates="plan_dieta")

class Seguimiento_Dieta(Base):
    __tablename__ = 'Seguimiento_Dieta'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_plan_dieta = Column(Integer, ForeignKey('Plan_Dieta_Usuario.id'))
    fecha = Column(Date)
    descripcion = Column(Text)

    plan_dieta = relationship("Plan_Dieta_Usuario", back_populates="seguimientos") 