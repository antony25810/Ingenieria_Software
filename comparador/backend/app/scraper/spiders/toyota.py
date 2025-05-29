from typing import List, Dict, Any, Optional
from .base import BaseSpider
import re
from datetime import datetime

class ToyotaSpider(BaseSpider):
    """Spider específico para extraer datos de camionetas Toyota"""
    
    def extract_vehicle_list(self) -> List[Dict[str, str]]:
        """Extrae la lista de URLs de vehículos desde la página principal de Toyota"""
        soup = self._get_page(self.url)
        if not soup:
            return []
        
        vehicles = []
        try:
            # Esta implementación debe adaptarse a la estructura real del sitio
            # Ejemplo: buscamos divs con clase específica para vehículos
            vehicle_containers = soup.find_all('div', class_='vehicle-card')
            
            for container in vehicle_containers:
                # Verificar si es una camioneta
                vehicle_type = container.find('span', class_='vehicle-type') # type: ignore
                if not vehicle_type or not any(truck_type in vehicle_type.text.lower() 
                                              for truck_type in ['truck', 'pickup', 'camioneta']):
                    continue
                
                # Extraer modelo
                model_element = container.find('h2', class_='model-name') # type: ignore
                if not model_element:
                    continue
                model = model_element.text.strip()
                
                # Extraer URL
                detail_link = container.find('a', class_='vehicle-details') # type: ignore
                if not detail_link or not detail_link.get('href'): # type: ignore
                    continue
                    
                detail_url = detail_link['href'] # type: ignore
                # Asegurar URL completa
                if not detail_url.startswith('http'): # type: ignore
                    detail_url = f"https://www.toyota.com{detail_url}"
                
                vehicles.append({
                    'model': model,
                    'url': detail_url
                })
            
            return vehicles
            
        except Exception as e:
            self.logger.error(f"Error extrayendo lista de vehículos: {str(e)}")
            return []
    
    def extract_vehicle_details(self, url: str, model: str) -> Dict[str, Any]:
        """Extrae detalles detallados de un vehículo Toyota"""
        soup = self._get_page(url)
        if not soup:
            return {}
            
        try:
            # Inicializar diccionario de datos
            vehicle_data = {
                'model': model,
                'year': datetime.now().year,  # Valor por defecto
                'detail_url': url,
                'specifications': {}
            }
            
            # Extraer año (si está disponible)
            year_element = soup.find('span', class_='year')
            if year_element:
                # Extraer año usando regex
                year_match = re.search(r'20\d{2}', year_element.text)
                if year_match:
                    vehicle_data['year'] = int(year_match.group())
            
            # Extraer precio
            price_element = soup.find('span', class_='price-value')
            if price_element:
                price_text = price_element.text.strip()
                # Limpiar formato de precio ($XX,XXX)
                price_match = re.search(r'[\d,]+', price_text)
                if price_match:
                    vehicle_data['price'] = float(price_match.group().replace(',', ''))
            
            # Extraer imagen
            image_element = soup.find('img', class_='hero-image')
            if image_element and image_element.get('src'): # type: ignore
                vehicle_data['image_url'] = image_element['src'] # type: ignore
            
            # Extraer especificaciones técnicas
            specs = {}
            
            # Capturar datos de motor
            engine_section = soup.find('div', id='engine')
            if engine_section:
                engine_type = engine_section.find('span', class_='engine-type') # type: ignore
                if engine_type:
                    specs['engine_type'] = engine_type.text.strip()
                
                displacement = engine_section.find('span', class_='displacement') # type: ignore
                if displacement:
                    # Extraer números de texto
                    displacement_match = re.search(r'([\d.]+)', displacement.text)
                    if displacement_match:
                        specs['engine_displacement'] = float(displacement_match.group())
                
                horsepower = engine_section.find('span', class_='horsepower') # type: ignore
                if horsepower:
                    hp_match = re.search(r'(\d+)', horsepower.text)
                    if hp_match:
                        specs['horsepower'] = int(hp_match.group())
                
                torque = engine_section.find('span', class_='torque') # type: ignore
                if torque:
                    torque_match = re.search(r'(\d+)', torque.text)
                    if torque_match:
                        specs['torque'] = int(torque_match.group())
            
            # Capturar capacidad de pasajeros
            capacity_element = soup.find('span', class_='passengers')
            if capacity_element:
                capacity_match = re.search(r'(\d+)', capacity_element.text)
                if capacity_match:
                    specs['passenger_capacity'] = int(capacity_match.group())
            
            # Capacidad de carga
            payload_element = soup.find('span', class_='payload')
            if payload_element:
                payload_match = re.search(r'([\d,]+)', payload_element.text)
                if payload_match:
                    specs['payload_capacity'] = float(payload_match.group().replace(',', ''))
            
            # Consumo de combustible
            mpg_element = soup.find('span', class_='mpg')
            if mpg_element:
                # Buscamos patrones como "18 ciudad / 24 carretera"
                mpg_text = mpg_element.text.strip()
                city_match = re.search(r'(\d+).*ciudad', mpg_text, re.IGNORECASE)
                highway_match = re.search(r'(\d+).*carretera', mpg_text, re.IGNORECASE)
                
                if city_match:
                    specs['fuel_economy_city'] = int(city_match.group(1))
                if highway_match:
                    specs['fuel_economy_highway'] = int(highway_match.group(1))
            
            # Agregar más extracción de datos según estructura real
            
            # Añadir especificaciones al vehículo
            vehicle_data['specifications'] = specs
            
            return vehicle_data
            
        except Exception as e:
            self.logger.error(f"Error extrayendo detalles de {model}: {str(e)}")
            return {
                'model': model,
                'detail_url': url
            }