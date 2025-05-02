from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from routes import seguimiento, auth, users, survey

app = FastAPI(
    title="EvolucionaT API",
    description="API para el sistema de seguimiento de progreso EvolucionaT",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173"],  # Puerto de Vite por defecto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manejador de errores de validación
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc)},
    )

# Incluir routers
app.include_router(auth.router, prefix="/api", tags=["autenticación"])
app.include_router(users.router, prefix="/api", tags=["usuarios"])
app.include_router(survey.router, prefix="/api", tags=["encuesta"])
app.include_router(seguimiento.router, prefix="/api", tags=["seguimiento"])

# Ruta de prueba
@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de EvolucionaT"}

# Ruta de salud
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 