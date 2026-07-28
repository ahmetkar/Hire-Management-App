# ==========================
# Build
# ==========================
FROM node:22-alpine AS builder

ARG APP_NAME

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
RUN npm ci

COPY . .

# Prisma Client oluştur 
RUN npx prisma generate --schema=libs/prisma/prisma/schema.prisma


# İlgili servisi build et
RUN npx nx build ${APP_NAME}

# Sadece production bağımlılıkları kalsın
RUN npm ci --omit=dev


# ==========================
# Runtime
# ==========================
FROM node:22-alpine

ARG APP_NAME

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

COPY --from=builder /app/libs/prisma ./libs/prisma
COPY --from=builder /app/libs/error-handler ./libs/error-handler
COPY --from=builder /app/libs/metrics ./libs/metrics

CMD ["node","dist/main.js"] 