#!/bin/bash

# Colores para salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Configurando entorno de desarrollo para Comparador de Camionetas...${NC}"

# Verificar instalación de Docker
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null
then
    echo -e "${RED}Docker y/o docker-compose no están instalados. Por favor instálalos primero.${NC}"
    exit 1
fi

# Crear entorno virtual de Python
echo "Creando entorno virtual Python..."
python -m venv venv
source venv/bin/activate

# Instalar dependencias de Python
echo "Instalando dependencias de Python..."
pip install -r requirements.txt

# Iniciar contenedores Docker
echo "Iniciando contenedores Docker..."
docker-compose up -d

# Esperar a que PostgreSQL esté listo
echo "Esperando a que PostgreSQL esté listo..."
sleep 10

# Ejecutar migraciones de base de datos
echo "Ejecutando migraciones de base de datos..."
cd backend
alembic upgrade head
cd ..

# Inicializar datos base
echo "Inicializando datos base..."
python -m backend.app.scripts.init_data

echo -e "${GREEN}¡Entorno de desarrollo configurado correctamente!${NC}"
echo -e "Backend API: http://localhost:8000"
echo -e "Frontend: http://localhost:3000"
echo -e "PgAdmin: http://localhost:5050"
echo -e "  - Email: admin@example.com"
echo -e "  - Password: admin"