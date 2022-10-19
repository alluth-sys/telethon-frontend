FROM node:current-alpine as build-stage
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . ./

FROM nginx:1.12-alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
