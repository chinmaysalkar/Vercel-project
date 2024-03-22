FROM node:16

WORKDIR '/app'

COPY package.json .

RUN npm i

COPY . .

# Expose port
EXPOSE 4000

CMD ["npm", "start"]