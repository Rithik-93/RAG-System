FROM node:20-alpine

# Install system dependencies and create app directory
RUN apk add --no-cache openssl
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

USER node

CMD ["npm", "run", "start"]