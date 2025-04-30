# This file makes the models directory a Python package 

from sqlalchemy.ext.declarative import declarative_base
from . import models_auto as models

# Crear la clase base para los modelos
Base = declarative_base()

# Exportar todos los modelos
__all__ = [
    'Base',
    'models',
    'Usuario',
    'PerfilUsuario',
    'PreferenciasAlimentarias',
    'AlimentosEvitados',
    'HistorialMedico',
    'HabitosDiarios',
    'PerfilRestriccion',
    'CondicionFisica'
] 