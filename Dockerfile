FROM node:alpine

COPY / /home/node/
WORKDIR /home/node

RUN apk add --no-cache tini \
&& npm ci --silent \
&& npm run build-app \
&& rm -rf node_modules

EXPOSE 8080

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npx", "http-server", "dist/journey-maps-client-testapp"]
