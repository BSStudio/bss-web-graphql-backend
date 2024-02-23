FROM node:20-alpine as base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

FROM base as builder
RUN npm install
COPY ./ ./
RUN npm run build

FROM base
COPY --from=builder /app/dist ./
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
