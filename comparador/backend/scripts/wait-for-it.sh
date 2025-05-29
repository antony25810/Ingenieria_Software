#!/bin/bash

HOST="$1"
PORT="$2"
TIMEOUT="${4:-30}"

if [[ $# -lt 2 ]]; then
  echo "Uso: wait-for-it host puerto [-t timeout]"
  exit 1
fi

echo "Esperando a que $HOST:$PORT esté disponible..."

start_time=$(date +%s)
while ! nc -z "$HOST" "$PORT" >/dev/null 2>&1; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  
  if [ $elapsed -ge "$TIMEOUT" ]; then
    echo "Tiempo de espera agotado después de $TIMEOUT segundos"
    exit 1
  fi
  
  sleep 1
done

echo "$HOST:$PORT está disponible después de $elapsed segundos"
exit 0