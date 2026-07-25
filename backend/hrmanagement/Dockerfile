# ==========================
# Build
# ==========================
FROM node:22-alpine AS builder

ARG APP_NAME

WORKDIR /

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

RUN npm ci

COPY . .

# Prisma Client oluştur 
RUN npx prisma generate --schema=lib/prisma/prisma/schema.prisma

# İlgili servisi build et
RUN npx nx build ${APP_NAME}

# Sadece production bağımlılıkları kalsın
RUN npm prune --omit=dev


# ==========================
# Runtime
# ==========================
FROM node:22-alpine

ARG APP_NAME

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /package*.json ./
COPY --from=builder /node_modules ./node_modules

COPY --from=builder /dist/apps/${APP_NAME} ./dist

# Lib dosyaları
COPY --from=builder /lib/prisma ./lib/prisma
COPY --from=builder /lib/error-handler ./lib/error-handler


EXPOSE 4000

CMD ["node","dist/main.js"]