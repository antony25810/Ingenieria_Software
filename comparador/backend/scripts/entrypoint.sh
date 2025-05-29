#!/bin/bash
set -e

echo "Iniciando script de entrypoint..."

# Esperar a que PostgreSQL esté disponible
if [ -n "$DATABASE_URL" ]; then
    echo "Esperando a que PostgreSQL esté disponible..."
    
    # Extraer host y puerto desde DATABASE_URL
    DB_HOST="postgres"
    DB_PORT="5432"
    
    # Usar comando básico para esperar conexión
    for i in $(seq 1 30); do
        echo "Intento $i: Conectando a $DB_HOST:$DB_PORT..."
        if timeout 1 bash -c "cat < /dev/null > /dev/tcp/$DB_HOST/$DB_PORT"; then
            echo "¡PostgreSQL está disponible!"
            break
        fi
        
        if [ $i -eq 30 ]; then
            echo "Error: No se pudo conectar a PostgreSQL después de 30 intentos"
            exit 1
        fi
        
        sleep 1
    done
else
    echo "ADVERTENCIA: Variable DATABASE_URL no definida"
fi

# Verificar si alembic.ini existe
if [ ! -f "/app/alembic.ini" ]; then
    echo "No se encontró alembic.ini. Creando configuración básica..."
    
    # Crear directorio de migraciones si no existe
    mkdir -p /app/migrations/versions
    touch /app/migrations/__init__.py
    touch /app/migrations/versions/__init__.py
    
    # Crear alembic.ini básico
    cat > /app/alembic.ini << EOF
[alembic]
script_location = migrations
file_template = %%(year)d%%(month).2d%%(day).2d_%%(hour).2d%%(minute).2d%%(second).2d_%%(rev)s_%%(slug)s
timezone = UTC
truncate_slug_length = 40
revision_environment = false
sourceless = false
version_locations = %(here)s/migrations/versions
output_encoding = utf-8
sqlalchemy.url = ${DATABASE_URL}

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
EOF

    # Crear env.py si no existe
    if [ ! -f "/app/migrations/env.py" ]; then
        cat > /app/migrations/env.py << EOF
import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config
from sqlalchemy import pool

# Añadir el directorio raíz al path para poder importar módulos de la aplicación
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importar el modelo Base
try:
    from app.models.database import Base
except ImportError:
    print("No se pudo importar Base desde app.models.database")
    Base = None

# Obtener la configuración de alembic.ini
config = context.config

# Sobrescribir la URL de la base de datos con la variable de entorno si está disponible
if os.getenv("DATABASE_URL"):
    config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

# Interpretar el archivo de configuración para Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Añadir el modelo MetaData para las migraciones 'autogenerate'
target_metadata = Base.metadata if Base else None

def run_migrations_offline():
    """Ejecutar migraciones en modo 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Ejecutar migraciones en modo 'online'."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
EOF
    fi
    
    # Crear script.py.mako si no existe
    if [ ! -f "/app/migrations/script.py.mako" ]; then
        cat > /app/migrations/script.py.mako << EOF
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
    ${upgrades if upgrades else "pass"}


def downgrade():
    ${downgrades if downgrades else "pass"}
EOF
    fi
    
    echo "Configuración de Alembic creada."
fi

# Ejecutar migraciones si alembic está disponible
if command -v alembic &> /dev/null; then
    echo "Ejecutando migraciones con Alembic..."
    cd /app && alembic upgrade head || echo "Error al ejecutar migraciones. Se intentará continuar..."
else
    echo "Alembic no disponible, instalando..."
    pip install alembic
    
    # Intentar ejecutar migraciones después de instalar
    echo "Ejecutando migraciones..."
    cd /app && alembic upgrade head || echo "Error al ejecutar migraciones. Se intentará continuar..."
fi

echo "Iniciando aplicación..."
cd /app && exec "$@"