FROM node:22 AS build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR '/app'

COPY package.json package-lock.json ./
RUN npm ci --include=dev --ignore-scripts

COPY --chown=node:node . .

RUN npm run build

RUN npm ci --omit=dev --ignore-scripts

FROM node:22-bookworm-slim 
ENV NODE_ENV production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR '/app'
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist

CMD ["dumb-init", "node", "./dist/main.js"]