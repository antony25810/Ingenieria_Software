#!/usr/bin/env python3
"""
Script para inicializar datos básicos en la base de datos.
- Crea marcas de camionetas si no existen
- Configura cualquier otro dato inicial necesario
"""
import logging
import sys
from pathlib import Path
from sqlalchemy.orm import Session

# Configurar path para importar desde app
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent.parent
sys.path.append(str(parent_dir))

from app.models.database import Brand
from app.services.db_service import get_db # type: ignore

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Datos iniciales de marcas
INITIAL_BRANDS = [
    {
        "name": "Toyota",
        "logo_url": "https://www.toyota.com/assets/img/header/toyota_logo.png",
        "website_url": "https://www.toyota.com/trucks/",
        "country": "Japón",
    },
    {
        "name": "Ford",
        "logo_url": "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/legacy/initialLoading.png",
        "website_url": "https://www.ford.com/trucks/",
        "country": "Estados Unidos",
    },
    {
        "name": "Chevrolet",
        "logo_url": "https://www.chevrolet.com/content/dam/chevrolet/na/us/english/index/index-nav/logo/chevy-logo.png",
        "website_url": "https://www.chevrolet.com/trucks",
        "country": "Estados Unidos",
    },
    {
        "name": "Nissan",
        "logo_url": "https://www.nissanusa.com/content/dam/Nissan/us/homepage/header/nissan-logo.png",
        "website_url": "https://www.nissanusa.com/vehicles/trucks.html",
        "country": "Japón",
    },
    {
        "name": "Ram",
        "logo_url": "https://www.ramtrucks.com/content/dam/fca-brands/na/ramtrucks/en_us/ram-logo.png",
        "website_url": "https://www.ramtrucks.com/",
        "country": "Estados Unidos",
    }
]

def init_brands(db: Session):
    """Inicializa las marcas en la base de datos si no existen"""
    created_count = 0
    
    for brand_data in INITIAL_BRANDS:
        # Verificar si la marca ya existe
        existing = db.query(Brand).filter(Brand.name == brand_data["name"]).first()
        
        if not existing:
            # Crear nueva marca
            brand = Brand(**brand_data)
            db.add(brand)
            created_count += 1
            logger.info(f"Marca creada: {brand_data['name']}")
    
    if created_count > 0:
        db.commit()
        logger.info(f"Total de {created_count} marcas creadas")
    else:
        logger.info("No se crearon nuevas marcas (ya existen)")

def main():
    """Función principal para inicializar datos"""
    logger.info("Iniciando proceso de inicialización de datos")
    
    # Obtener conexión a la base de datos
    db = next(get_db())
    
    try:
        # Inicializar marcas
        init_brands(db)
        
        logger.info("Inicialización de datos completada exitosamente")
    except Exception as e:
        logger.error(f"Error durante la inicialización de datos: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()