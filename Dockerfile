FROM node:alpine

COPY / /home/node/
WORKDIR /home/node

RUN apk add --no-cache tini \
&& npm install --global http-server \
&& npm ci --silent \
&& npm run build-testapp \
&& rm -rf node_modules

EXPOSE 8080

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["http-server", "dist/journey-maps-client-testapp"]
