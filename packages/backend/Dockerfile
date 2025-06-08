FROM node:18-alpine AS builder

WORKDIR /app

# 🔐 SSL SUPPORT: Install OpenSSL and dependencies for Prisma
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev

# Copy root package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies
RUN npm ci --workspace=packages/backend

# Copy backend source
COPY packages/backend ./packages/backend

# Generate Prisma client and build
WORKDIR /app/packages/backend
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# 🔐 SSL SUPPORT: Install OpenSSL runtime libraries
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backend

# Copy the ROOT node_modules (includes Prisma client)
COPY --from=builder /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package.json ./package.json
COPY --from=builder /app/packages/backend/prisma ./prisma

# Change ownership
RUN chown -R backend:nodejs /app

USER backend

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["sh", "-c", "npx prisma db push && npm start"]
