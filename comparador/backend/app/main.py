from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging

from .config import settings
from .api.routes import vehicles, scraping
from .models.database import Base
from .services.db_service import DBService

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para la comparación de camionetas de diferentes marcas",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, limitar a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas de API
app.include_router(
    vehicles.router, # type: ignore
    prefix=f"{settings.API_V1_STR}/vehicles",
    tags=["vehicles"],
)

app.include_router(
    scraping.router, # type: ignore
    prefix=f"{settings.API_V1_STR}/scraping",
    tags=["scraping"],
)

@app.get("/")
def read_root():
    return {
        "message": f"Bienvenido a la API de {settings.PROJECT_NAME}",
        "docs": f"{settings.API_V1_STR}/docs",
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check(db: Session = Depends(DBService)):
    """Endpoint para verificar la salud de la API y la conexión a la base de datos"""
    try:
        # Verificar conexión a la base de datos
        db.execute("SELECT 1") # type: ignore
        return {
            "status": "ok",
            "environment": settings.ENVIRONMENT,
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Error de salud: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error de salud: No se pudo conectar a la base de datos: {str(e)}"
        )