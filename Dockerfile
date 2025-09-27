# ---------- Build stage ----------
FROM node:20-slim AS builder

# (Optional here, but harmless)
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl libssl3 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install ALL deps for build/typegen
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client for build steps (typegen etc.)
RUN npx prisma generate

# Build Next.js
RUN npm run build


# ---------- Production runner ----------
FROM node:20-slim AS runner
WORKDIR /app

# Prisma needs OpenSSL at runtime; healthcheck uses curl
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl libssl3 curl \
 && rm -rf /var/lib/apt/lists/*

# Install production deps only
COPY package*.json ./
RUN npm ci --production

# App artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

# Ensure required dirs exist and are writable
RUN mkdir -p /app/prisma /app/public/uploads /challenges \
 && useradd -u 1001 -ms /sbin/nologin nextjs \
 && chown -R 1001:1001 /app /challenges
USER nextjs

# Defaults (override in compose)
ENV NODE_ENV=production
ENV PORT=3000
# Use an absolute, stable default; compose can override
ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV CHALLENGES_DIR=/challenges
ENV INGEST_CHALLENGES_AT_STARTUP=false

EXPOSE 3000

# Regenerate Prisma Client against the runner's node_modules to ensure matching engines
# (and clear any stale engine caches just in case)
RUN rm -rf node_modules/.prisma /tmp/prisma-engines || true
RUN npx prisma generate

# Run migrations, seed, then start
CMD npx prisma migrate deploy && \
    npx prisma db seed && \
    npm start

