# Build this image: *cd to parent dir!* `docker build -t mdworld/homeremote:latest -f homeremote-nestjs-server/Dockerfile .`
# Show images: `docker images`
# Run container from this image: `docker run --rm --name homeremote -v /absPath/hr/build-docker/settings:/app -p 3201:3200 mdworld/homeremote:latest`
# when developing, with -rm:
# docker run --rm --name homeremote \
#     --env-file /absPath/repos/hr/build-docker/settings/.env \
#     -v /absPath/repos/hr/build-docker/settings/auth.json:/app/dist/auth.json \
#     -p 3201:3200 \
#     mdworld/homeremote:latest
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
COPY homeremote-server/package.json ./
COPY homeremote-server/yarn.lock ./
RUN apk add --no-cache curl \
    && apk add --no-cache --virtual .gyp python make g++ \
    && yarn --frozen-lockfile \
    && apk del .gyp

# add server
COPY homeremote-server/. ./

# TODO build client outside Dockerfile in build script so a set of static assets is available for copying here. No runtime dependencies are needed here.
# add client
COPY homeremote/build/. ./client

# Set-up auth.json for unit tests on prebuild
RUN cp ./auth.json.example ./auth.json

RUN yarn build

# the file that is created cp
RUN rm ./auth.json

# the file that is created by yarn build
RUN rm ./dist/auth.json

# https://docs.docker.com/storage/bind-mounts/#mount-into-a-non-empty-directory-on-the-container
# start app
CMD ["yarn", "start:prod"]

# TODO multi stage build!

# TODO add .dockerignore?
# TODO git clone fresh repos
