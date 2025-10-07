# Racks Telegram Bot

Bot de Telegram desarrollado en Node.js utilizando [`node-telegram-bot-api`]. Incluye Dockerfile para despliegue en contenedor.

## Tabla de contenidos
- [Requisitos](#requisitos)
- [Configuración](#configuración)
- [Instalación y uso](#instalación-y-uso)
- [Docker](#docker)
- [Estructura](#estructura)
- [Desarrollo](#desarrollo)
- [Despliegue](#despliegue)
- [Registro y métricas](#registro-y-métricas)
- [Pruebas](#pruebas)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

## Requisitos
- Node.js LTS (≥ 18.x recomendado)
- npm (incluido con Node.js)
- Token de bot de Telegram (BotFather)

> Si usas Docker, no necesitas Node.js en la máquina host.

## Configuración
1. Crea el bot en **@BotFather** y copia el token.
2. Define variables de entorno:
   - `TELEGRAM_BOT_TOKEN`: token del bot (obligatorio)
   - `NODE_ENV`: `production` o `development` (opcional)

Puedes usar un archivo `.env` en desarrollo:
```
TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=development
```

## Instalación y uso
```bash
# Clonar
git clone https://github.com/wall3n/Racks-telegram-bot.git
cd Racks-telegram-bot

# Instalar dependencias
npm install

# Ejecutar
node bot.js
# o, si existe script:
npm start
```

El bot utiliza *long polling* por defecto (según la librería). Para webhooks, añade configuración de URL y certificado si aplica (no incluido aquí).

## Docker
Compila y ejecuta el contenedor:

```bash
# Build
docker build -t racks-telegram-bot .

# Run (long polling)
docker run --rm   -e TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx   --name racks-bot racks-telegram-bot
```

> Ajusta la política de reinicio para producción:
```bash
docker run -d --restart unless-stopped   -e TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx   --name racks-bot racks-telegram-bot
```

## Estructura
```
.
├── bot.js                 # Punto de entrada del bot
├── package.json           # Metadatos y dependencias
├── package-lock.json
├── Dockerfile             # Imagen de producción
├── .dockerignore
├── runtime.txt            # Info de runtime (referencial)
├── docker-runtime.txt     # Info de runtime (referencial)
└── LICENSE (MIT)
```

## Desarrollo
Sugerido:
- Linter: ESLint
- Formateo: Prettier
- Variables de entorno con `dotenv` en local

Recarga en caliente (si lo añades):
```bash
npm i -D nodemon
npx nodemon bot.js
```

## Despliegue
Opciones típicas:
- **Docker** en VPS (Systemd + reinicio automático)
- **Docker Compose** para gestionar variables y logs
- PaaS (Railway, Fly.io, Render) con variable `TELEGRAM_BOT_TOKEN`

Ejemplo `docker-compose.yml` mínimo:
```yaml
services:
  racks-bot:
    image: racks-telegram-bot:latest
    build: .
    restart: unless-stopped
    environment:
      TELEGRAM_BOT_TOKEN: "${TELEGRAM_BOT_TOKEN}"
```

## Registro y métricas
- Salida estándar para logs (`stdout`/`stderr`)
- Integra posteriormente:
  - `pino` o `winston` para logs estructurados
  - Prometheus endpoint si se requiere observabilidad

## Pruebas
Recomendado:
```bash
npm i -D jest
# Añade tests en __tests__/ y script "test"
npm test
```

## Comandos
Revisa `bot.js` para ver comandos y handlers implementados.
- Ejemplos habituales (ajusta a la realidad del código):
  - `/start` — mensaje de bienvenida
  - Comandos específicos del proyecto

## Roadmap
- [ ] Scripts npm (`start`, `dev`, `lint`, `test`)
- [ ] Configuración de webhooks opcional
- [ ] Healthcheck para Docker
- [ ] CI (GitHub Actions) para lint/test/build
- [ ] Documentar comandos y ejemplos de uso

## Licencia
MIT. Consulta `LICENSE`.
