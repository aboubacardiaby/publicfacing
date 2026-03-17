# ---- Build stage (optional: useful if you add a build tool later) ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
# No build step needed for pure static — just pass files through

# ---- Serve stage ----
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static site files
COPY --from=builder /app/index.html  /usr/share/nginx/html/
COPY --from=builder /app/css         /usr/share/nginx/html/css
COPY --from=builder /app/js          /usr/share/nginx/html/js

# Cloud Run sends traffic on PORT env var (default 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
