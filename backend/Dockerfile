FROM node:18-alpine AS builder

# Install OpenSSL for Prisma engine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma client
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:18-alpine

# Install OpenSSL for Prisma engine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

# Push schema to DB then seed and start the app
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && node dist/main"]
