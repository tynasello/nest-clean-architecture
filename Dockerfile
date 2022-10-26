FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# install app dependencies 
RUN npm ci

# bundle app source
COPY --chown=node:node . .

# generate prisma client
RUN npm run prisma:generate

USER node