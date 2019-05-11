FROM node:10-alpine
COPY ./ /app
WORKDIR /app
RUN npm install &&  npm i @vue/cli-service && npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
