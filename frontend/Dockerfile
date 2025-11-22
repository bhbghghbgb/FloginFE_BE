# -----------------------------------------------------------------
# STAGE 1: Build the Node/Vite application (Build Stage)
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (using ci is best for CI/CD environments)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application. The output is placed in /app/dist
RUN npm run build

# -----------------------------------------------------------------
# STAGE 2: Serve the static files (Production Stage)
# Use a lightweight web server image (Nginx is common, but static serving is easier)
FROM caddy:2.7.6-alpine AS final

# Remove default Caddyfile
RUN rm /etc/caddy/Caddyfile

# Copy the production build artifact from the build stage
COPY --from=build /app/dist /usr/share/caddy

# Custom Caddyfile to serve the static files, ensuring all non-file requests 
# (for SPAs) fall back to index.html
COPY Caddyfile /etc/caddy/Caddyfile
# Note: Since the backend is a separate service, this Caddyfile won't handle API proxying, 
# but the frontend will be built with VITE_API_BASE_URL pointing to the backend service.

# Caddy exposes port 80 by default. Expose port 3000 for E2E testing access outside the compose network.
EXPOSE 3000