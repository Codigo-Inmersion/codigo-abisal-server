# ========= Etapa 1: dependencias de producción =========
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
# Comentario:
# - 'npm ci' instala exactamente lo que hay en package-lock.
# - '--omit=dev' deja solo deps de producción (más pequeño).

# ========= Etapa 2: compilar TypeScript a dist/ =========
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                           # aquí sí instalamos devDependencies (ts, tipos, etc.)
COPY tsconfig.json ./
COPY src ./src
RUN npm run build                    # genera dist/app.js (coincide con tu package.json)

# ========= Etapa 3: imagen final para ejecutar =========
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copiamos lo mínimo necesario para correr
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Seguridad: no correr como root
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app
USER app

EXPOSE 8000
# Muy importante: en Render se usa process.env.PORT automáticamente
CMD ["node", "dist/app.js"]
