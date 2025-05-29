from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Table, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# Tabla de relación muchos a muchos para características opcionales
vehicle_feature = Table(
    'vehicle_feature', 
    Base.metadata,
    Column('vehicle_id', Integer, ForeignKey('vehicles.id'), primary_key=True),
    Column('feature_id', Integer, ForeignKey('features.id'), primary_key=True)
)

# Tabla para Marcas
class Brand(Base):
    __tablename__ = 'brands'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    logo_url = Column(String(255))
    website_url = Column(String(255))
    country = Column(String(100))
    
    # Relaciones
    vehicles = relationship("Vehicle", back_populates="brand")
    
    def __repr__(self):
        return f"<Brand {self.name}>"

# Tabla para Vehículos
class Vehicle(Base):
    __tablename__ = 'vehicles'
    
    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey('brands.id'), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    price = Column(Float)
    image_url = Column(String(255))
    detail_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(Date, default=datetime.now().date())
    updated_at = Column(Date, default=datetime.now().date(), onupdate=datetime.now().date())
    
    # Relaciones
    brand = relationship("Brand", back_populates="vehicles")
    specifications = relationship("VehicleSpecification", back_populates="vehicle", uselist=False, cascade="all, delete-orphan")
    features = relationship("Feature", secondary=vehicle_feature, back_populates="vehicles")
    
    def __repr__(self):
        return f"<Vehicle {self.brand.name if self.brand else 'Unknown'} {self.model} ({self.year})>"

# Tabla para Especificaciones Técnicas
class VehicleSpecification(Base):
    __tablename__ = 'vehicle_specifications'
    
    id = Column(Integer, primary_key=True)
    vehicle_id = Column(Integer, ForeignKey('vehicles.id'), unique=True, nullable=False)
    
    # Especificaciones generales
    engine_type = Column(String(100))
    engine_displacement = Column(Float)       # en litros
    horsepower = Column(Integer)              # en HP
    torque = Column(Integer)                  # en lb-ft
    transmission = Column(String(100))        # automática, manual, etc.
    drivetrain = Column(String(50))           # tracción: 4x2, 4x4, AWD, etc.
    
    # Dimensiones y capacidad
    length = Column(Float)                    # en mm
    width = Column(Float)                     # en mm
    height = Column(Float)                    # en mm
    wheelbase = Column(Float)                 # en mm
    ground_clearance = Column(Float)          # en mm
    passenger_capacity = Column(Integer)      # número de pasajeros
    cargo_capacity = Column(Float)            # en litros
    towing_capacity = Column(Float)           # en kg
    payload_capacity = Column(Float)          # en kg
    fuel_tank_capacity = Column(Float)        # en litros
    
    # Rendimiento
    fuel_economy_city = Column(Float)         # en km/l o mpg
    fuel_economy_highway = Column(Float)      # en km/l o mpg
    fuel_economy_combined = Column(Float)     # en km/l o mpg
    acceleration_0_100 = Column(Float)        # en segundos
    
    # Relación
    vehicle = relationship("Vehicle", back_populates="specifications")
    
    def __repr__(self):
        return f"<VehicleSpecification for {self.vehicle.model if self.vehicle else 'Unknown'}>"

# Tabla para Características Opcionales
class Feature(Base):
    __tablename__ = 'features'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    category = Column(String(50))             # seguridad, confort, tecnología, etc.
    description = Column(Text)
    
    # Relación
    vehicles = relationship("Vehicle", secondary=vehicle_feature, back_populates="features")
    
    def __repr__(self):
        return f"<Feature {self.name}>"

# Tabla para Seguimiento de Scraping
class ScrapingLog(Base):
    __tablename__ = 'scraping_logs'
    
    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey('brands.id'))
    url = Column(String(255))
    start_time = Column(Date, default=datetime.now().date())
    end_time = Column(Date)
    status = Column(String(50))               # success, error, in_progress
    vehicles_found = Column(Integer, default=0)
    vehicles_added = Column(Integer, default=0)
    vehicles_updated = Column(Integer, default=0)
    error_message = Column(Text)
    
    # Relación
    brand = relationship("Brand")
    
    def __repr__(self):
        return f"<ScrapingLog {self.start_time} {self.brand.name if self.brand else 'Unknown'} {self.status}>"