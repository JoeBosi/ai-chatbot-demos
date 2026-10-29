#!/usr/bin/env bash
# Put back the image that was running before the last ./deploy.sh. The database is untouched:
# a rollback undoes code, never data (a migration already applied stays applied).
set -euo pipefail
cd "$(dirname "$0")"
[ -f .env.production ] || { echo "missing .env.production" >&2; exit 1; }
docker image inspect chatbot-clinica:prev >/dev/null 2>&1 || { echo "no chatbot-clinica:prev image: nothing to roll back to" >&2; exit 1; }

echo "rolling back to the image tagged :prev ($(docker image inspect -f '{{.Created}}' chatbot-clinica:prev))"
docker image tag chatbot-clinica:latest chatbot-clinica:broken || true
docker image tag chatbot-clinica:prev chatbot-clinica:latest
docker compose --env-file .env.production up -d --no-build --remove-orphans
for i in $(seq 1 60); do
  if curl -fsS http://127.0.0.1:3050/api/health >/dev/null 2>&1; then echo "healthy"; exit 0; fi
  sleep 2
done
echo "app not healthy after 120s" >&2
docker compose --env-file .env.production logs --tail 80 app >&2
exit 1
