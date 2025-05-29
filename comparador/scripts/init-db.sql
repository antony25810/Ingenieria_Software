-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para búsquedas de texto eficientes

-- Crear esquema para la aplicación
CREATE SCHEMA IF NOT EXISTS app;

-- Comentarios de la base de datos
COMMENT ON DATABASE camionetas_db IS 'Base de datos para la aplicación de comparación de camionetas';