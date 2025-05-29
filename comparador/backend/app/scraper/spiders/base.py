import requests
from bs4 import BeautifulSoup
import logging
import time
import random
from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod
from ...config import settings

class BaseSpider(ABC):
    """Clase base para todos los spiders de scraping"""
    
    def __init__(self, url: str, brand_id: int, brand_name: str):
        self.url = url
        self.brand_id = brand_id
        self.brand_name = brand_name
        self.logger = logging.getLogger(f"scraper.{self.__class__.__name__}")
        
        # Configurar sesión HTTP
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': settings.USER_AGENT,
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Connection': 'keep-alive',
        })
    
    def _get_page(self, url: str) -> Optional[BeautifulSoup]:
        """Obtiene el contenido HTML de una página y lo convierte a BeautifulSoup"""
        try:
            # Delay aleatorio para evitar bloqueos
            time.sleep(random.uniform(
                settings.SCRAPING_DELAY_MIN, 
                settings.SCRAPING_DELAY_MAX
            ))
            
            self.logger.info(f"Requesting: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            return BeautifulSoup(response.text, 'html.parser')
        except requests.RequestException as e:
            self.logger.error(f"Error al obtener la página {url}: {str(e)}")
            return None
    
    @abstractmethod
    def extract_vehicle_list(self) -> List[Dict[str, str]]:
        """
        Extrae la lista de URLs de vehículos desde la página principal.
        Debe devolver una lista de diccionarios con las claves:
        - model: nombre del modelo
        - url: URL de la página de detalles
        """
        pass
        
    @abstractmethod
    def extract_vehicle_details(self, url: str, model: str) -> Dict[str, Any]:
        """
        Extrae detalles detallados de un vehículo desde su página individual.
        Debe implementarse en cada spider específico.
        """
        pass
    
    def run(self) -> List[Dict[str, Any]]:
        """Ejecuta el spider completo y devuelve los datos extraídos"""
        self.logger.info(f"Iniciando extracción para {self.brand_name} desde {self.url}")
        
        # Obtener la lista de vehículos
        vehicle_list = self.extract_vehicle_list()
        if not vehicle_list:
            self.logger.warning(f"No se encontraron vehículos para {self.brand_name}")
            return []
            
        self.logger.info(f"Encontrados {len(vehicle_list)} vehículos para {self.brand_name}")
        
        # Extraer detalles de cada vehículo
        results = []
        for vehicle_info in vehicle_list:
            try:
                details = self.extract_vehicle_details(
                    vehicle_info['url'], 
                    vehicle_info['model']
                )
                
                if details:
                    # Añadir información de la marca
                    details['brand_id'] = self.brand_id
                    details['model'] = vehicle_info['model']
                    results.append(details)
            except Exception as e:
                self.logger.error(f"Error procesando {vehicle_info['model']}: {str(e)}")
        
        self.logger.info(f"Extracción completada para {self.brand_name}: {len(results)} vehículos con detalles")
        return results