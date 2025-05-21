# Futbol Tracker

**Descripción:**  
Proyecto para hacer seguimiento de partidos de fútbol de la Liga MX y torneos europeos, mostrando calendario semanal, resultados recientes y canales/plataformas de transmisión.

## Estructura

- `backend/`: Scraping, base de datos, API REST.
- `frontend/`: Interfaz de usuario (prototipo en Streamlit).
- `data/`: Archivos de datos (base de datos, backups).
- `setup.sh`: Script para iniciar entorno.

## Instalación rápida

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend (en otra terminal)
cd frontend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Uso

1. Ejecuta el scraper y la API backend.
2. Levanta la app frontend.

---