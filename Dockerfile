# ── ETAPA 1: BUILDER (Vite build) ───────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# VITE_ vars se "queman" en el bundle al hacer build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
# ── ETAPA 2: NGINX (servir el bundle estático) ──────────
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]