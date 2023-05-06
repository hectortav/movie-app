# Movie app

## Info


The project is deployed using docker, docker-compose and nginx.

## Tech stack

-   TypeScript
-   Node.js
-   REST
-   Express
-   Next.js
-   React.js
-   Turborepo
-   Tailwindcss
-   PostgreSQL
-   Redis
-   Prisma
-   Jest
-   Docker
-   Docker compose

## Installation guide

```bash
git clone git@github.com:hectortav/movie-app.git

# install docker
sudo apt-get update -y;
sudo apt-get upgrade -y;
sudo apt install docker.io -y;
systemctl start docker;
systemctl enable docker;

# install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

cd movie-app
cd apps/model && npx prisma generate
cd ../../

# complete the .env file

# run in development
yarn
yarn dev


# run production

yarn
yarn build
yarn start

```

You can also run the project by running `docker-compose up`
