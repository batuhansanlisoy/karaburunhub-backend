# 1. Aşama: Base (Her iki ortam için ortak)
FROM node:20-alpine AS base
WORKDIR /app
RUN mkdir -p upload
COPY package*.json ./
RUN npm install
COPY . .

# 2. Aşama: Development (Sadece dev için)
FROM base AS development
EXPOSE 3000 9229
CMD ["npm", "run", "dev"]

# 3. Aşama: Build (Prod öncesi derleme)
FROM base AS build
RUN npm run build

# 4. Aşama: Production (Canlı ortam)
FROM node:20-alpine AS production
WORKDIR /app

# Derlenmiş JavaScript kodlarını al (Zaten dist/src içine gidiyorlar)
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# KRİTİK DÜZELTME: Knex dosyaları artık src altındaydı, build aşamasından oradan çekiyoruz
COPY --from=build /app/src/knexfile.ts ./src/knexfile.ts
COPY --from=build /app/src/db/migrations ./src/db/migrations
COPY --from=build /app/src/db/seeds ./src/db/seeds
# Sadece prod paketlerini kur
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]