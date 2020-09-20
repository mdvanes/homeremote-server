
## Development flow

* set port in main.ts to 3001
* start dev server: `npm run start:dev`
* in the UI project start the dev server with `npm run start:dev`
* generate a new route (i.e. controller), e.g. /api/switches with `nest g co switches`
* add prefix `api/` manually in /switches/switches.controller.ts

## Adding a user

* enable getHash in profile.controllers.ts
* start dev server: `npm run start:dev`
* for password "test", call (e.g. in browser) `http://localhost:3000/api/gethash?password=test`
* store the hash with the username in auth.json
* disable getHash in profile.controllers.ts

## Deployment flow

* in web project do a "build"?
* copy assets to "client" dir?
* commit/tag/push
* on server: git pull and run
* later: git pull and build from Dockerfile
* when this runs in a Docker container, will it still be able to access other Docker containers?
    * difficult when doing "exec" from node, e.g. to do `docker ps -as --format='{{json .}}'` (see system guides for more commands)
    * Using Docker Engine API: curl --unix-socket /var/run/docker.sock http:/v1.24/containers/json?all=true
        * [{"Id":"e0c4e45edf36fbaf2b07b1248c5c169de6ded19b8297251d96d90f45409b4036","Names":["/portainer"],"Image":"portainer/portainer","ImageID":"sha256:62771b0b9b0973a3e8e95595534a1240d8cfd968d30ec82dc0393ce0a256c5f3","Command":"/portainer","Created":1596817545,"Ports":[{"IP":"0.0.0.0","PrivatePort":8000,"PublicPort":8000,"Type":"tcp"},{"IP":"0.0.0.0","PrivatePort":9000,"PublicPort":9000,"Type":"tcp"}],"Labels":{},"State":"running","Status":"Up 6 days","HostConfig":{"NetworkMode":"default"},"NetworkSettings":{"Networks":{"bridge":{"IPAMConfig":null,"Links":null,"Aliases":null,"NetworkID":"5c4e60ee78497152bb5ae636c2fd5eb4979c79df95b49569309b7427da807d76","EndpointID":"cecdb1db8f7d48ed0f847014d331ce42b161bc6a4a953b1f5bf4b69c096158bc","Gateway":"172.17.0.1","IPAddress":"172.17.0.2","IPPrefixLen":16,"IPv6Gateway":"","GlobalIPv6Address":"","GlobalIPv6PrefixLen":0,"MacAddress":"02:42:ac:11:00:02","DriverOpts":null}}},"Mounts":[{"Type":"bind","Source":"/var/run/docker.sock","Destination":"/var/run/docker.sock","Mode":"","RW":true,"Propagation":"rprivate"},{"Type":"volume","Name":"portainer_data","Source":"/var/lib/docker/volumes/portainer_data/_data","Destination":"/data","Driver":"local","Mode":"z","RW":true,"Propagation":""}]}]


## Description

NestJS API for [Homeremote](https://github.com/mdvanes/homeremote) web app.
Build with [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

* and open http://localhost:3000/auth/login
* log in with john/test ?
* create hash from password: http://localhost:3000/api/gethash?password=test

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
