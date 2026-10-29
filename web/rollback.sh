#!/usr/bin/env bash
# Put back the image that was running before the last ./deploy.sh. The database is untouched:
# a rollback undoes code, never data (a migration already applied stays applied).
set -euo pipefail
cd "$(dirname "$0")"
[ -f .env.production ] || { echo "missing .env.production" >&2; exit 1; }
docker image inspect chat-bot-web:prev >/dev/null 2>&1 || { echo "no chat-bot-web:prev image: nothing to roll back to" >&2; exit 1; }

echo "rolling back to the image tagged :prev ($(docker image inspect -f '{{.Created}}' chat-bot-web:prev))"
docker image tag chat-bot-web:latest chat-bot-web:broken || true
docker image tag chat-bot-web:prev chat-bot-web:latest
docker compose --env-file .env.production up -d --no-build --remove-orphans
for i in $(seq 1 60); do
  if curl -fsS http://127.0.0.1:3040/api/health >/dev/null 2>&1; then echo "healthy"; exit 0; fi
  sleep 2
done
echo "app not healthy after 120s" >&2
docker compose --env-file .env.production logs --tail 80 app >&2
exit 1
