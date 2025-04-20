from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import usuarios
from app.routes import perfil_usuario
from app.routes import meta_usuario
from app.routes import seguimiento_meta
app = FastAPI(title="EvolucionaT Backend")

# Permitir comunicación desde el frontend (React)
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

# Aquí se importarán y montarán las rutas
# from app.routes import usuarios
# app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(perfil_usuario.router, prefix="/perfil", tags=["Perfil Usuario"])
app.include_router(meta_usuario.router, prefix="/meta", tags=["Meta Usuario"])
app.include_router(seguimiento_meta.router, prefix="/seguimiento-meta", tags=["Seguimiento Meta"])

@app.get("/")
def root():
    return {"message": "¡Bienvenido al backend de EvolucionaT!"}