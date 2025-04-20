from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
def root():
    return {"message": "¡Bienvenido al backend de EvolucionaT!"}