FROM node:16

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci

COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start"]
