FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]