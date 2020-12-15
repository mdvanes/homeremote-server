# Build this image: *cd to parent dir!* `docker build -t mdworld/homeremote:latest -f homeremote-nestjs-server/Dockerfile .`
# Show images: `docker images`
# Run container from this image: `docker run --rm --name homeremote -v /absPath/hr/build-docker/settings:/app -p 3201:3200 mdworld/homeremote:latest`
# when developing, with -rm:
# docker run --rm --name homeremote \
#     --env-file $(pwd)/settings/.env \
#     -v $(pwd)/settings/auth.json:/app/dist/auth.json \
#     -v /mnt/disk3t/Media/Music/Various/Songs\ from/:/songsfrom \
#     -p 3201:3200 \
#     mdworld/homeremote:latest
# Export this image: `docker save mdworld/homeremote:latest -o mdworld_homeremote__latest.tar`
# Remove image from the store: `docker rmi mdworld/homeremote:latest`
# Import an exported image: `docker load -i mdworld_homeremote__latest.tar`

# pull official base image
FROM node:15.0.1-alpine AS build-env

# set working directory
WORKDIR /build

# add `/app/node_modules/.bin` to $PATH
ENV PATH /build/node_modules/.bin:$PATH

# install app dependencies
COPY homeremote-server/package.json ./
COPY homeremote-server/yarn.lock ./
RUN apk add --no-cache curl python \
    && apk add --no-cache --virtual .gyp make g++ \
    && yarn --frozen-lockfile

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

# Remove node_modules
RUN rm -rf node_modules \
    # Install without devDependencies
    && yarn --frozen-lockfile --prod \
    && apk del .gyp

# TODO add .dockerignore?

# final stage

FROM node:15.0.1-alpine
WORKDIR /app
COPY --from=build-env /build/ /app/
# Install runtime dependencies
RUN apk add --no-cache curl python ffmpeg py3-eyed3

# https://docs.docker.com/storage/bind-mounts/#mount-into-a-non-empty-directory-on-the-container
# start app
CMD ["yarn", "start:prod"]

# TODO multi stage build! (just by adding the second stage with copy, the image size already shrinks from 561MB to 348MB. By just installing the devDependencies the image shrinks from 348MB to 197MB)
