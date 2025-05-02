# This file makes the models directory a Python package 

from .base import Base, User, SurveyResponse
from . import models_auto as models

# Exportar todos los modelos
__all__ = [
    'Base',
    'User',
    'SurveyResponse',
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