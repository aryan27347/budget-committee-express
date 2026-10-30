FROM node:26-alpine3.23

WORKDIR /www/budget-committee-backend

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]