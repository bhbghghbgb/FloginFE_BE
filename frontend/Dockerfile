# --- Build stage ---
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Run with Nginx ---
FROM nginx:1.25
WORKDIR /usr/share/nginx/html

# Xóa file default
RUN rm -rf ./*

# Copy build từ stage đầu
COPY --from=build /app/build .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
