# Build this image: `docker build -t mdworld/homeremote:latest .`
# Show images: `docker images`
# Run container from this image: `docker run --rm --name homeremote -p 3201:3200 mdworld/homeremote:latest`
# Export this image: `docker save mdworld/homeremote:latest -o mdworld_homeremote__latest.tar`
# Remove image from the store: `docker rmi mdworld/homeremote:latest`
# Import an exported image: `docker load -i mdworld_homeremote__latest.tar`

# pull official base image
FROM node:15.0.1-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN apk add --no-cache --virtual .gyp python make g++ \
    && yarn --frozen-lockfile \
    && apk del .gyp

# add app
COPY . ./

# start app
CMD ["yarn", "start:prod"]

# TODO multi stage build!
