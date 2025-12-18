Запуск

docker compose -f docker-compose.dev.yml --env-file .env.dev up -d
docker compose -f docker-compose.dev.yml logs -f api

Открывать

Web: http://localhost:3000
API: http://localhost:3001

Остановить

docker compose -f docker-compose.dev.yml down

Снести базу

docker compose -f docker-compose.dev.yml down -v

pnpm run start:dev

на сервере перезапуск

docker compose --env-file .env up -d --force-recreate