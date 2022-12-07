FROM node:18-alpine As development
USER node
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run prisma:generate

#

FROM node:18-slim AS production
USER node
WORKDIR /usr/src/app
COPY --from=development --chown=root:root /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]
