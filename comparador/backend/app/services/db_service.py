from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional, Union, Tuple as PyTuple
from datetime import datetime

from ..models.database import Brand, Vehicle, VehicleSpecification, Feature, ScrapingLog
from ..config import settings

class DBService:
    """Servicio para operaciones de base de datos"""
    
    def __init__(self, db: Session):
        self.db = db
    
    # ----- Operaciones de Marca -----
    
    def get_all_brands(self) -> List[Brand]:
        """Obtiene todas las marcas"""
        return self.db.query(Brand).all()
    
    def get_brand_by_id(self, brand_id: int) -> Optional[Brand]:
        """Obtiene una marca por su ID"""
        return self.db.query(Brand).filter(Brand.id == brand_id).first()
    
    def get_brand_by_name(self, name: str) -> Optional[Brand]:
        """Obtiene una marca por su nombre"""
        return self.db.query(Brand).filter(Brand.name.ilike(f"%{name}%")).first()
    
    def create_brand(self, brand_data: Dict[str, Any]) -> Brand:
        """Crea una nueva marca"""
        brand = Brand(**brand_data)
        self.db.add(brand)
        self.db.commit()
        self.db.refresh(brand)
        return brand
    
    def update_brand(self, brand_id: int, brand_data: Dict[str, Any]) -> Optional[Brand]:
        """Actualiza una marca existente"""
        brand = self.get_brand_by_id(brand_id)
        if not brand:
            return None
            
        for key, value in brand_data.items():
            if hasattr(brand, key):
                setattr(brand, key, value)
                
        self.db.commit()
        self.db.refresh(brand)
        return brand
    
    # ----- Operaciones de Vehículo -----
    
    def get_vehicles(self, filters: Dict[str, Any] = None) -> List[Vehicle]: # type: ignore
        """Obtiene vehículos con filtros opcionales"""
        query = self.db.query(Vehicle)
        
        if filters:
            if 'brand_ids' in filters and filters['brand_ids']:
                query = query.filter(Vehicle.brand_id.in_(filters['brand_ids']))
                
            if 'min_year' in filters and filters['min_year']:
                query = query.filter(Vehicle.year >= filters['min_year'])
                
            if 'max_year' in filters and filters['max_year']:
                query = query.filter(Vehicle.year <= filters['max_year'])
                
            if 'min_price' in filters and filters['min_price']:
                query = query.filter(Vehicle.price >= filters['min_price'])
                
            if 'max_price' in filters and filters['max_price']:
                query = query.filter(Vehicle.price <= filters['max_price'])
                
            if 'is_active' in filters:
                query = query.filter(Vehicle.is_active == filters['is_active'])
                
            # Filtros avanzados en especificaciones
            if any(key.startswith('spec_') for key in filters.keys()):
                query = query.join(VehicleSpecification)
                
                if 'spec_min_passengers' in filters and filters['spec_min_passengers']:
                    query = query.filter(
                        VehicleSpecification.passenger_capacity >= filters['spec_min_passengers']
                    )
                
                if 'spec_min_horsepower' in filters and filters['spec_min_horsepower']:
                    query = query.filter(
                        VehicleSpecification.horsepower >= filters['spec_min_horsepower']
                    )
                
                if 'spec_min_towing' in filters and filters['spec_min_towing']:
                    query = query.filter(
                        VehicleSpecification.towing_capacity >= filters['spec_min_towing']
                    )
            
            # Filtro por características
            if 'feature_ids' in filters and filters['feature_ids']:
                for feature_id in filters['feature_ids']:
                    query = query.filter(
                        Vehicle.features.any(Feature.id == feature_id)
                    )
        
        return query.all()
    
    def get_vehicle_by_id(self, vehicle_id: int) -> Optional[Vehicle]:
        """Obtiene un vehículo por su ID"""
        return self.db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    
    def get_vehicle_by_brand_and_model(self, brand_id: int, model: str, year: int) -> Optional[Vehicle]:
        """Obtiene un vehículo por marca, modelo y año"""
        return self.db.query(Vehicle).filter(
            Vehicle.brand_id == brand_id,
            Vehicle.model == model,
            Vehicle.year == year
        ).first()
    
    def create_vehicle(self, vehicle_data: Dict[str, Any]) -> Vehicle:
        """
        Crea un nuevo vehículo con sus especificaciones
        
        El diccionario vehicle_data debe contener:
        - Atributos básicos del vehículo (model, year, etc.)
        - Una clave 'specifications' con un diccionario de especificaciones
        """
        # Extraer especificaciones si existen
        specs_data = vehicle_data.pop('specifications', {})
        
        # Crear vehículo
        vehicle = Vehicle(**vehicle_data)
        self.db.add(vehicle)
        self.db.flush()  # Para obtener el ID sin commit
        
        # Crear especificaciones si existen
        if specs_data:
            specs = VehicleSpecification(vehicle_id=vehicle.id, **specs_data)
            self.db.add(specs)
        
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle
    
    def update_vehicle(self, vehicle_id: int, vehicle_data: Dict[str, Any]) -> Optional[Vehicle]:
        """Actualiza un vehículo existente y sus especificaciones"""
        vehicle = self.get_vehicle_by_id(vehicle_id)
        if not vehicle:
            return None
        
        # Extraer especificaciones si existen
        specs_data = vehicle_data.pop('specifications', None)
        
        # Actualizar atributos del vehículo
        for key, value in vehicle_data.items():
            if hasattr(vehicle, key):
                setattr(vehicle, key, value)
        
        # Actualizar especificaciones si existen
        if specs_data and vehicle.specifications:
            for key, value in specs_data.items():
                if hasattr(vehicle.specifications, key):
                    setattr(vehicle.specifications, key, value)
        elif specs_data:
            # Crear especificaciones si no existen
            specs = VehicleSpecification(vehicle_id=vehicle.id, **specs_data)
            self.db.add(specs)
        
        vehicle.updated_at = datetime.now().date() # type: ignore
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle
    
    def save_or_update_vehicle(self, vehicle_data: Dict[str, Any]) -> PyTuple[Vehicle, bool]:
        """
        Guarda un vehículo nuevo o actualiza uno existente si ya existe
        Devuelve el vehículo y un booleano indicando si fue creado (True) o actualizado (False)
        """
        brand_id = vehicle_data.get('brand_id')
        model = vehicle_data.get('model')
        year = vehicle_data.get('year', datetime.now().year)
        
        # Buscar vehículo existente
        existing = self.get_vehicle_by_brand_and_model(brand_id, model, year) # type: ignore
        
        if existing:
            # Actualizar existente
            updated = self.update_vehicle(existing.id, vehicle_data) # type: ignore
            return updated, False # type: ignore
        else:
            # Crear nuevo
            created = self.create_vehicle(vehicle_data)
            return created, True # type: ignore
    
    # ----- Operaciones de Log de Scraping -----
    
    def create_scraping_log(self, log_data: Dict[str, Any]) -> ScrapingLog:
        """Crea un nuevo registro de log de scraping"""
        log = ScrapingLog(**log_data)
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log
    
    def update_scraping_log(self, log_id: int, log_data: Dict[str, Any]) -> Optional[ScrapingLog]:
        """Actualiza un log de scraping existente"""
        log = self.db.query(ScrapingLog).filter(ScrapingLog.id == log_id).first()
        if not log:
            return None
            
        for key, value in log_data.items():
            if hasattr(log, key):
                setattr(log, key, value)
                
        self.db.commit()
        self.db.refresh(log)
        return log