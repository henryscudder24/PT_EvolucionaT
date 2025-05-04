from datetime import datetime
import re
from typing import List, Dict, Any

def parse_training_plan_table(text: str) -> List[Dict]:
    """
    Parsea una tabla de plan de entrenamiento generada por OpenAI.
    La tabla debe tener columnas: Fecha | Tipo de día | Ejercicio | Series | Repeticiones | Descanso | Notas
    """
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Eliminar líneas separadoras
    lines = [line for line in lines if not line.startswith('|--')]
    
    # Encontrar los índices de las columnas
    header_line = next(line for line in lines if 'Fecha' in line)
    headers = [h.strip() for h in header_line.split('|')]
    
    fecha_idx = headers.index('Fecha')
    tipo_dia_idx = headers.index('Tipo de día')
    ejercicio_idx = headers.index('Ejercicio')
    series_idx = headers.index('Series')
    repeticiones_idx = headers.index('Repeticiones')
    descanso_idx = headers.index('Descanso')
    notas_idx = headers.index('Notas')
    
    # Procesar cada línea de datos
    plan = []
    current_date = None
    current_day = None
    
    for line in lines:
        if '|' not in line or 'Fecha' in line:
            continue
            
        values = [v.strip() for v in line.split('|')]
        
        try:
            # Convertir fecha
            fecha = datetime.strptime(values[fecha_idx], '%d-%m-%Y').strftime('%Y-%m-%d')
            
            # Si es una nueva fecha, crear nuevo día
            if fecha != current_date:
                if current_day:
                    plan.append(current_day)
                current_date = fecha
                current_day = {
                    'fecha': fecha,
                    'tipo_dia': values[tipo_dia_idx],
                    'ejercicios': []
                }
            
            # Añadir ejercicio
            ejercicio = values[ejercicio_idx]
            if ejercicio:  # Solo añadir si hay un ejercicio
                # Convertir series y repeticiones a números
                series = int(values[series_idx]) if values[series_idx].isdigit() else 0
                repeticiones = int(values[repeticiones_idx]) if values[repeticiones_idx].isdigit() else 0
                
                # Asegurar valores mínimos para ejercicios de fuerza
                if current_day['tipo_dia'].lower() == 'fuerza':
                    series = max(series, 3)
                    repeticiones = max(repeticiones, 8)
                
                current_day['ejercicios'].append({
                    'nombre': ejercicio,
                    'series': series,
                    'repeticiones': repeticiones,
                    'descanso': values[descanso_idx],
                    'notas': values[notas_idx]
                })
                
        except (ValueError, IndexError) as e:
            logger.error(f"Error al procesar línea: {line}. Error: {str(e)}")
            continue
    
    # Añadir el último día
    if current_day:
        plan.append(current_day)
    
    return plan

def parse_meal_plan_table(table_text: str) -> List[Dict[str, Any]]:
    """
    Parsea la tabla de plan de comidas generada por OpenAI.
    Retorna una lista de diccionarios con los datos estructurados.
    """
    # Dividir el texto en líneas y eliminar líneas vacías
    lines = [line.strip() for line in table_text.split('\n') if line.strip()]
    
    # Eliminar la línea de separación (|-----|)
    lines = [line for line in lines if not re.match(r'^\|[\s-]+\|$', line)]
    
    # Obtener los índices de las columnas
    header = lines[0]
    fecha_idx = header.find('| Fecha')
    comida_idx = header.find('| Comida')
    plato_idx = header.find('| Plato')
    proteinas_idx = header.find('| Proteínas')
    grasas_idx = header.find('| Grasas')
    carbohidratos_idx = header.find('| Carbohidratos')
    calorias_idx = header.find('| Kcal Totales')
    
    # Procesar cada línea de datos
    plan = []
    current_date = None
    current_day = None
    
    for line in lines[1:]:  # Saltar el encabezado
        if not line.startswith('|'):
            continue
            
        # Extraer valores
        fecha = line[fecha_idx:comida_idx].strip('| ').strip()
        tipo_comida = line[comida_idx:plato_idx].strip('| ').strip()
        plato = line[plato_idx:proteinas_idx].strip('| ').strip()
        proteinas = line[proteinas_idx:grasas_idx].strip('| ').strip()
        grasas = line[grasas_idx:carbohidratos_idx].strip('| ').strip()
        carbohidratos = line[carbohidratos_idx:calorias_idx].strip('| ').strip()
        calorias = line[calorias_idx:].strip('| ').strip()
        
        # Convertir fecha
        try:
            fecha = datetime.strptime(fecha, '%d-%m-%Y').date()
        except ValueError:
            continue
            
        # Si es un nuevo día, crear nueva entrada
        if fecha != current_date:
            if current_day:
                plan.append(current_day)
            current_date = fecha
            current_day = {
                'fecha': fecha,
                'comidas': []
            }
        
        # Agregar comida
        try:
            current_day['comidas'].append({
                'tipo_comida': tipo_comida,
                'plato': plato,
                'proteinas': float(proteinas),
                'grasas': float(grasas),
                'carbohidratos': float(carbohidratos),
                'calorias': float(calorias)
            })
        except ValueError:
            continue
    
    # Agregar el último día
    if current_day:
        plan.append(current_day)
        
    return plan 