from typing import Dict, Union
from decimal import Decimal

def calculate_tmb(edad: int, genero: str, peso: Decimal, altura: Decimal) -> float:
    """
    Calcula la Tasa Metabólica Basal (TMB) usando la fórmula de Mifflin-St Jeor.
    
    Args:
        edad: Edad en años
        genero: 'masculino' o 'femenino'
        peso: Peso en kilogramos
        altura: Altura en centímetros
    
    Returns:
        float: TMB en calorías por día
    """
    # Convertir Decimal a float para los cálculos
    peso_float = float(peso)
    altura_float = float(altura)
    
    # Fórmula de Mifflin-St Jeor
    tmb = (10 * peso_float) + (6.25 * altura_float) - (5 * edad)
    
    # Ajuste según género
    if genero.lower() == 'masculino':
        tmb += 5
    else:
        tmb -= 161
        
    return round(tmb, 2)

def calculate_ideal_weight(altura: Decimal, genero: str) -> float:
    """
    Calcula el Peso Ideal usando la fórmula de Devine.
    
    Args:
        altura: Altura en centímetros
        genero: 'masculino' o 'femenino'
    
    Returns:
        float: Peso ideal en kilogramos
    """
    # Convertir altura de cm a pulgadas
    altura_pulgadas = float(altura) / 2.54
    
    # Fórmula de Devine
    if genero.lower() == 'masculino':
        peso_ideal = 50 + 2.3 * (altura_pulgadas - 60)
    else:
        peso_ideal = 45.5 + 2.3 * (altura_pulgadas - 60)
        
    return round(peso_ideal, 2)

def calculate_max_heart_rate(edad: int) -> int:
    """
    Calcula la Frecuencia Cardíaca Máxima usando la fórmula de Tanaka.
    
    Args:
        edad: Edad en años
    
    Returns:
        int: Frecuencia cardíaca máxima en latidos por minuto
    """
    # Fórmula de Tanaka: 208 - (0.7 * edad)
    fcm = 208 - (0.7 * edad)
    return round(fcm)

def calculate_imc(peso: Decimal, altura: Decimal) -> Dict[str, Union[float, str]]:
    """
    Calcula el Índice de Masa Corporal (IMC) y su categoría.
    
    Args:
        peso: Peso en kilogramos
        altura: Altura en centímetros
    
    Returns:
        Dict con el valor del IMC y su categoría
    """
    peso_float = float(peso)
    altura_float = float(altura) / 100  # Convertir a metros
    imc = peso_float / (altura_float * altura_float)
    
    # Determinar categoría
    if imc < 18.5:
        categoria = "Bajo peso"
    elif imc < 27:
        categoria = "Normal (saludable)"
    elif imc < 32:
        categoria = "Sobrepeso"
    elif imc < 37:
        categoria = "Obesidad grado I"
    elif imc < 42:
        categoria = "Obesidad grado II"
    else:
        categoria = "Obesidad grado III"
    
    return {
        "valor": round(imc, 2),
        "categoria": categoria
    }

def calculate_all_metrics(edad: int, genero: str, peso: Decimal, altura: Decimal) -> Dict[str, Union[float, int, Dict]]:
    """
    Calcula todas las métricas de salud.
    
    Args:
        edad: Edad en años
        genero: 'masculino' o 'femenino'
        peso: Peso en kilogramos
        altura: Altura en centímetros
    
    Returns:
        Dict con todas las métricas calculadas
    """
    imc_data = calculate_imc(peso, altura)
    return {
        "tmb": calculate_tmb(edad, genero, peso, altura),
        "peso_ideal": calculate_ideal_weight(altura, genero),
        "frecuencia_cardiaca_maxima": calculate_max_heart_rate(edad),
        "imc": imc_data
    } 