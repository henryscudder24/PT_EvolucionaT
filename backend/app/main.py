from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import survey, usuarios, survey_data, seguimiento, training
from .database import engine
from .models import models_auto as models

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuración de CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Incluir los routers
app.include_router(survey.router, prefix="/api")
app.include_router(usuarios.router, prefix="/api/usuarios")
app.include_router(survey_data.router, prefix="/api")
app.include_router(seguimiento.router, prefix="/api")
app.include_router(training.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "API de EvolucionaT"}