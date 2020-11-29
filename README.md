# Homeremote API

NestJS API for [Homeremote](https://github.com/mdvanes/homeremote) web app.
Build with [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn
```

## Development flow

* start nginx proxy: `yarn start:dev-nginx` (see NGINX chapter), this will run on port 3002
* in same terminal, start dev API server: `yarn start:dev`, this will run on port 3001 (prod on port 3200)
* in the UI project start the dev webpack server with `yarn start:dev`, this will run on port 3000
* generate a new route (i.e. controller), e.g. /api/switches with `nest g co switches`
* add prefix `api/` manually in /switches/switches.controller.ts

## Adding a user

* enable getHash in profile.controllers.ts
* start dev server: `yarn start:dev`
* for password "test", call (e.g. in browser) `http://localhost:3000/api/gethash?password=test`
* store the hash with the username in auth.json
* disable getHash in profile.controllers.ts

## Deployment flow

Temporary deployment flow (to local machine):

* if never done before, copy the full `homeremote-nestjs-server` dir to a new `homeremote-v2-dist` dir, including `node_modules`, `src`, root files, etc.
* in `homeremote-v2` (client) dir, run `yarn build` (prebuild should run, running unit tests and linting)
* run `yarn deploy` (copies generated `build` dir to `homeremote-nestjs-server/client`)
* in `homeremote-nestjs-server` (server) dir, run `yarn build` (prebuild should run, running unit tests and linting)
* run `yarn deploy` (copies generated `dist` dir to `homeremote-v2-dist/dist`)
* ? potentially clean `homeremote-v2-dist` dir and reset everything from step 1?
* in `homeremote-v2-dist` dir, update `.env` if needed
* in `homeremote-v2-dist` dir, run `nvm use 15 && node dist/src/main`

Target deployment flow:

* in web project do a "build"?
* copy assets to "client" dir?
* commit/tag/push
* on server: git pull and run
* later: git pull and build from Dockerfile
* when this runs in a Docker container, will it still be able to access other Docker containers?
    * difficult when doing "exec" from node, e.g. to do `docker ps -as --format='{{json .}}'` (see system guides for more commands)
    * Using Docker Engine API: curl --unix-socket /var/run/docker.sock http:/v1.24/containers/json?all=true
        * [{"Id":"e0c4e45edf36fbaf2b07b1248c5c169de6ded19b8297251d96d90f45409b4036","Names":["/portainer"],"Image":"portainer/portainer","ImageID":"sha256:62771b0b9b0973a3e8e95595534a1240d8cfd968d30ec82dc0393ce0a256c5f3","Command":"/portainer","Created":1596817545,"Ports":[{"IP":"0.0.0.0","PrivatePort":8000,"PublicPort":8000,"Type":"tcp"},{"IP":"0.0.0.0","PrivatePort":9000,"PublicPort":9000,"Type":"tcp"}],"Labels":{},"State":"running","Status":"Up 6 days","HostConfig":{"NetworkMode":"default"},"NetworkSettings":{"Networks":{"bridge":{"IPAMConfig":null,"Links":null,"Aliases":null,"NetworkID":"5c4e60ee78497152bb5ae636c2fd5eb4979c79df95b49569309b7427da807d76","EndpointID":"cecdb1db8f7d48ed0f847014d331ce42b161bc6a4a953b1f5bf4b69c096158bc","Gateway":"172.17.0.1","IPAddress":"172.17.0.2","IPPrefixLen":16,"IPv6Gateway":"","GlobalIPv6Address":"","GlobalIPv6PrefixLen":0,"MacAddress":"02:42:ac:11:00:02","DriverOpts":null}}},"Mounts":[{"Type":"bind","Source":"/var/run/docker.sock","Destination":"/var/run/docker.sock","Mode":"","RW":true,"Propagation":"rprivate"},{"Type":"volume","Name":"portainer_data","Source":"/var/lib/docker/volumes/portainer_data/_data","Destination":"/data","Driver":"local","Mode":"z","RW":true,"Propagation":""}]}]

## Nginx docker container for development

Because forwarding http-only cookie only works on the same domain (with current settings [insert links to article here]), use this NGINX container
that forwards traffic from both the front-end and the back-end from the same port.

Before running `yarn start:dev` (for the server), in the same terminal run:

* `yarn start:dev-nginx`
* `docker ps` and visit localhost:3002

Notes:

* Authentication Testing Dashboard can't be reached with this proxy, just use http://localhost:3001/
* Add the current host IP to docker: docker run --add-host localnode:192.168.0.17
* Get current IP with `ifconfig eth0 | grep inet | grep -v inet6 | awk '{print $2}'` (or see this for automatic: https://stackoverflow.com/questions/27810076/how-do-i-access-a-server-on-localhost-with-nginx-docker-container)
* The nginx.conf is read from this dir
* In nginx.conf proxypass use localnode instead of localhost.

## Running the app

```bash
# development
$ start proxy docker container
$ yarn start

* and open http://localhost:3000/auth/login
* log in with flap/1
* create hash from password: http://localhost:3000/api/gethash?password=test

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
