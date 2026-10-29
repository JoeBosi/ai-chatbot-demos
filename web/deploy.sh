#!/usr/bin/env bash
# Build and (re)start the production stack on this VPS. Never removes the database volume.
set -euo pipefail
cd "$(dirname "$0")"
[ -f .env.production ] || { echo "missing .env.production" >&2; exit 1; }

# Keep the image that is running now as :prev, so ./rollback.sh can put it back in seconds.
# Without this the only way back would be rebuilding from older sources, which nobody has time
# for while the site is down.
if docker image inspect chat-bot-web:latest >/dev/null 2>&1; then
  docker image tag chat-bot-web:latest chat-bot-web:prev
fi

docker compose --env-file .env.production up -d --build --remove-orphans
for i in $(seq 1 60); do
  if curl -fsS http://127.0.0.1:3040/api/health >/dev/null 2>&1; then echo "healthy"; exit 0; fi
  sleep 2
done
echo "app not healthy after 120s" >&2
docker compose --env-file .env.production logs --tail 80 app >&2
exit 1
