FROM node:18-alpine AS builder

WORKDIR /app

# Copy ALL package.json files (root, frontend, backend)
COPY package*.json ./
COPY packages/web/package*.json ./packages/web/
COPY packages/backend/package*.json ./packages/backend/

# Install ALL dependencies (frontend + backend)
RUN npm ci

# Copy the real backend source (now dependencies are available)
COPY packages/backend/src ./packages/backend/src

# Copy frontend source
COPY packages/web ./packages/web

# Build frontend (now @prisma/client is available!)
WORKDIR /app/packages/web
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/packages/web/dist /usr/share/nginx/html
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 frontend && \
    chown -R frontend:nodejs /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown frontend:nodejs /var/run/nginx.pid

USER frontend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
