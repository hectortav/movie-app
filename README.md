# Workable assignment

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
git clone git@github.com:hectortav/workable-assignment.git

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

cd workable-assignment
cd apps/model && npx prisma generate
cd ../../

# run in development
yarn
yarn dev


# run production

yarn
yarn build
yarn start
```
