FROM node:20-alpine

# Docker içindeki çalışma dizinimiz
WORKDIR /app

# Sadece paket dosyalarını kopyalayıp yükleme yapıyoruz (Hız için)
COPY package*.json ./
RUN npm install

# Geri kalan her şeyi (src, knexfile.ts, tsconfig.json vb.) kopyala
COPY . .

# Uygulamanın çalışacağı port
EXPOSE 3000
EXPOSE 9229

# Senin çalıştırdığın komut
CMD ["npm", "run", "dev"]