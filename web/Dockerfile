# Next.js dashboard. Reads the shared SQLite volume; serves the UI + API.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production \
    DATABASE_URL=/data/energy.db \
    TZ=Asia/Kolkata
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/src ./src
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

VOLUME ["/data"]
EXPOSE 3000

# Ensure schema + active tariff exist, then serve.
CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm start"]
