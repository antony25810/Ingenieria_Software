from pydantic import field_validator    
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/camionetas_db"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Comparador de Camionetas"
    ENVIRONMENT: str = "development"
    
    # Configuraciones para scraping
    SCRAPING_DELAY_MIN: float = 1.5
    SCRAPING_DELAY_MAX: float = 3.5
    USER_AGENT: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    
    # Validador de ejemplo (usa la nueva sintaxis)
    @field_validator("DATABASE_URL")
    def validate_database_url(cls, v):
        if not v.startswith("postgresql://"):
            raise ValueError("La URL de la base de datos debe ser PostgreSQL")
        return v
    
    # Configuración de modelo
    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
    }

settings = Settings()