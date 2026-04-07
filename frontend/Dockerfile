FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG GRAPHQL_URL=http://localhost:4000/graphql
RUN sed -i.bak "s|https://YOUR_BACKEND_URL/graphql|${GRAPHQL_URL}|g" src/environments/environment.prod.ts && npm run build -- --configuration production

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
