# Base Image
FROM node:latest

WORKDIR '/app'

# Install dependencies
COPY package.json .
RUN npm install
COPY . .

# Commands
CMD [ "npm", "run", "start" ]