from app.database import SessionLocal
from app.models import models_auto as models

db = SessionLocal()

# ---------------------------
# Catálogo: Tipo_Usuario
# ---------------------------
tipos_usuario = ["Cliente", "Administrador"]
for desc in tipos_usuario:
    db.add(models.TipoUsuario(descripcion=desc))


# ---------------------------
# Catálogo: Tipo_Objetivo
# ---------------------------
objetivos = [
    "Pérdida de peso", "Ganancia de masa muscular", "Mejora de la resistencia",
    "Mejora de la flexibilidad", "Mantenimiento de la salud", "Rendimiento deportivo"
]
for desc in objetivos:
    db.add(models.TipoObjetivo(descripcion=desc))

# ---------------------------
# Perfil "Catálogo" para sugerencias
# ---------------------------
usuario_catalogo = db.query(models.Usuario).filter_by(correo="catalogo@evolucionat.com").first()
if not usuario_catalogo:
    usuario_catalogo = models.Usuario(
        nombre="Catálogo",
        correo="catalogo@evolucionat.com",
        contraseña="no-se-usa"
    )
    db.add(usuario_catalogo)
    db.commit()
    db.refresh(usuario_catalogo)

perfil_catalogo = models.PerfilUsuario(
    genero="otro",
    edad=0,
    peso=0,
    altura=0,
    nivel_actividad="sedentario",
    objetivo_principal="Pérdida de peso",
    tiempo_meta="n/a",
    nivel_compromiso=5,
    id_usuario=usuario_catalogo.id 
)
db.add(perfil_catalogo)
db.commit()
db.refresh(perfil_catalogo)    

# ---------------------------
# Catálogo: Tipo_Dieta
# ---------------------------
dietas = ["Omnívora", "Vegetariana", "Vegana", "Pescetariana", "Paleo", "Cetogénica", "Sin gluten", "Sin lactosa"]

# ---------------------------
# Catálogo: Estado_Plan
# ---------------------------
estados_plan = ["Activo", "Pausado", "Finalizado"]
for desc in estados_plan:
    db.add(models.EstadoPlan(descripcion=desc))

# ---------------------------
# Catálogo: Estado_Meta
# ---------------------------
estados_meta = ["Pendiente", "En progreso", "Completada", "Cancelada"]
for desc in estados_meta:
    db.add(models.EstadoMeta(descripcion=desc))

# ---------------------------
# Catálogo: Estado_Rutina
# ---------------------------
estados_rutina = ["Sin iniciar", "Activa", "Completada"]
for desc in estados_rutina:
    db.add(models.EstadoRutina(descripcion=desc))

# ---------------------------
# Catálogo: Restriccion_Usuario
# ---------------------------
restricciones = ["Frutos secos", "Lácteos", "Mariscos", "Huevos", "Gluten", "Soja", "Otro"]
for desc in restricciones:
    db.add(models.RestriccionUsuario(descripcion=desc))

# ---------------------------
# Catálogo: Preferencias alimentarias sugeridas (id_perfil = 0)
# ---------------------------
# Dietas sugeridas
id_catalogo = perfil_catalogo.id

for valor in dietas:
    db.add(models.PreferenciasAlimentarias(id_perfil=perfil_catalogo.id, tipo="dieta", valor=valor))

# Alergias sugeridas
for valor in restricciones:
    db.add(models.PreferenciasAlimentarias(id_perfil=perfil_catalogo.id, tipo="alergia", valor=valor))

# Favoritos sugeridos
favoritos = [
    "Carnes", "Pollo", "Pescados", "Verduras", "Frutas",
    "Pastas", "Arroz", "Legumbres", "Lácteos", "Snacks saludables"
]
for valor in favoritos:
    db.add(models.PreferenciasAlimentarias(id_perfil=perfil_catalogo.id, tipo="favorito", valor=valor))

# ---------------------------
# Confirmar todo
# ---------------------------
db.commit()
db.close()

print("Catálogos + preferencias sembrados exitosamente.")