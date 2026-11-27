#!/usr/bin/env bash
# Comprueba que package-lock.json sirve para instalar en Linux (como en GitHub Actions y en el servidor).
# npm en macOS a veces deja fuera del lock las dependencias opcionales de Linux al añadir o actualizar
# paquetes, y entonces «npm ci» falla en Linux. Si pasa: rm -rf node_modules package-lock.json && npm install
#   npm run comprobar-lock         (necesita Docker; lo lanza solo el hook .githooks/pre-push)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
if ! docker info >/dev/null 2>&1; then
  echo "comprobar-lock: Docker no está en marcha; no se ha podido comprobar el package-lock.json en Linux." >&2
  exit 0
fi
# Solo los package.json y el lock tal como están en el último commit
archivos=$(git ls-files | grep -E '(^|/)package(-lock)?\.json$')
if git archive HEAD -- $archivos | docker run --rm -i node:24-alpine sh -c 'mkdir /w && cd /w && tar -x && npm ci --ignore-scripts --no-audit --no-fund --loglevel=error >/dev/null'; then
  echo "comprobar-lock: el package-lock.json instala bien en Linux."
else
  echo "comprobar-lock: el package-lock.json NO instala en Linux. Regenéralo: rm -rf node_modules package-lock.json && npm install" >&2
  exit 1
fi
