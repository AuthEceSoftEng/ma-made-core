# ma-made-core
Open Data and Services Platform (ODSP) core

> This repository refers to the environment that hosts the core part of the Open Data and Services Platform (ODSP). 

This repository contains the following technologies:

  - [Docker](https://www.docker.com/)
  - [Express](http://expressjs.com/)
  - [Node.js](https://nodejs.org/en/)
  - [Python3](https://www.python.org/)

## Developer guidelines

### Environmental variables
> The applications module uses [dotenv](https://www.npmjs.com/package/dotenv) package for the enrironment variables management.

The following environment variables are the ones required:

- `NODE_ENV`| development or production
- `PORT`| The server port (DEFAULT: 5000) 
- `apps_vm_url` 
| It refers to the url through which the application module is accessible
(e.g. `http://vm_ip_address:port`)
- `code_repository_url` 
| It refers to the url through which the code repository is accessible
(e.g. `http://vm_ip_address:port`)
- `code_repository_port` 
| It refers to the port through which the code repository is exposed
(e.g. `10082`)
- `platform_url` 
| It refers to the port through which the platform is accessible
(e.g. `http://vm_ip_address:port`)
- `admin_token` 
| It refers to the token of the administrator of the code repository
(e.g. `token`)

### Setup

  1. Install docker
  2. Install gitlab (is used as the source code host and as the authentication server). In order to install gitlab, you can use the following commands:
```
# The DB part
docker run --name gitlab-postgresql -d \
    --env 'DB_NAME=gitlabhq_production' \
    --env 'DB_USER=gitlab' --env 'DB_PASS=password' \
    --env 'DB_EXTENSION=pg_trgm' \
    --volume /srv/docker/gitlab/postgresql:/var/lib/postgresql \
    sameersbn/postgresql:9.5-1

# The caching part
docker run --name gitlab-redis -d \
    --volume /srv/docker/gitlab/redis:/var/lib/redis \
    sameersbn/redis:latest

# The gitlab instance
docker run --name gitlab -d \
    --link gitlab-postgresql:postgresql --link gitlab-redis:redisio \
    --publish 10023:22 --publish 10081:80 \
    --env 'GITLAB_PORT=10081' --env 'GITLAB_SSH_PORT=10023' \
    --env 'GITLAB_SECRETS_DB_KEY_BASE=long-and-random-alpha-numeric-string' \
    --env 'GITLAB_SECRETS_SECRET_KEY_BASE=long-and-random-alpha-numeric-string' \
    --env 'GITLAB_SECRETS_OTP_KEY_BASE=long-and-random-alpha-numeric-string' \
    --volume /srv/docker/gitlab/gitlab:/home/git/data \
    sameersbn/gitlab:8.11.4
```


  3. Install [nvm](https://github.com/creationix/nvm) so that playing with node versions is easier
  4. Install node through nvm. We are working with at least the version `8.9.4`:
    - `nvm install 8.9.4`
  5. Do `npm install` to install dependencies.
  6. Run the application with: `npm start`
