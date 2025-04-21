from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import usuarios
from app.routes import perfil_usuario
from app.routes import meta_usuario
from app.routes import seguimiento_meta
from app.routes import habitos_diarios
from app.routes import historial_medico
from app.routes import preferencias_alimentarias
from app.routes import alimentos_evitados
from app.routes import progreso_usuario
from app.routes import plan_dieta_usuario




app = FastAPI(title="EvolucionaT Backend")


origins = [
    "http://localhost:3000",  
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(perfil_usuario.router, prefix="/perfil", tags=["Perfil Usuario"])
app.include_router(meta_usuario.router, prefix="/meta", tags=["Meta Usuario"])
app.include_router(seguimiento_meta.router, prefix="/seguimiento-meta", tags=["Seguimiento Meta"])
app.include_router(habitos_diarios.router, prefix="/habitos", tags=["Hábitos Diarios"])
app.include_router(historial_medico.router, prefix="/historial", tags=["Historial Médico"])
app.include_router(preferencias_alimentarias.router, prefix="/preferencias", tags=["Preferencias Alimentarias"])
app.include_router(alimentos_evitados.router, prefix="/evitados", tags=["Alimentos Evitados"])
app.include_router(progreso_usuario.router, prefix="/progreso", tags=["Progreso Usuario"])
app.include_router(plan_dieta_usuario.router, prefix="/plan-dieta", tags=["Plan Dieta Usuario"])






@app.get("/")
def root():
    return {"message": "¡Bienvenido al backend de EvolucionaT!"}