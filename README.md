# Workable assignment

## TODO

-   [x] Define requirements and functionality
-   [x] Create user stories
-   [x] Define tech stack
-   [x] Break into subproblems
-   [x] Define DB schema
-   [ ] Describe API
-   [x] Create & configure monorepo
-   [x] Add and configure tools to enforce code quality
-   [x] Create minor CI/CD pipeline
-   [ ] Transform requirements to unit tests
-   [ ] Write code to satisfy tests
-   [ ] Performance tunning
-   [ ] Refactor
-   [ ] Deploy
-   [ ] Write report

## Define requirements and functionality

-   Users can share movies
-   Each movie has
    -   Title
    -   Description
    -   Date (createdAt)
    -   User that submitted (Reference)
-   Users can like or hate movies
-   Can view page unregistered
-   View movies
-   Like or hate movie
-   Voting can be changed and retracted
-   MVC framework
-   Authentication (login/sign up)
-   Authorization
-   Add movies by completing forms
-   Vote only once for each movie
-   Cannot vote for the movies they have submitted
-   View movies and sort them by
    -   likes
    -   hates
    -   date added
-   View all movies submitted by specific user
-   Include installation instructions or preferable provide with a running instance
-   Include addition features
<!-- update movie, user -->

## Create user stories

-   As a user, I want to open the Home page, so that I can view movies
-   As a user, I want to use filters, so that I can sort the movies by positive or negative votes and date
-   As an unauthenticated\_ user, I want to view buttons, so that I can log in or register.
-   As an _authenticated_ user, I want to complete a form, so that I can add my movies.
-   As an _authenticated_ user, I want to vote, so that I can express how I feel for a movie.
-   As an _authenticated_ user, I want to change vote, so that I can express I changed my mind.
-   As a user, I want to open a user's page, so that I can see the movies they created.

## Define tech stack

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
-   Cypress
-   Docker
-   Docker compose
-   Nginx
-   Digital ocean

## Break into subproblems

-   [x] Connect & initialize DBs
-   [x] Create express server
-   [ ] Connect frontend to backend
-   [x] Create register
-   [x] Create login
-   [x] Create session & auth middleware
-   [x] Auth state frontend
-   [x] Create movie form
-   [x] Create movies
-   [x] Display all movies
-   [ ] Like/Hate a movie
-   [x] Sort movies
-   [x] View movies by user
-   [ ] Dockerize
-   [ ] Deploy

## Define DB schema

```markdown
# Table: User
```

| Column    | Type            |
| --------- | --------------- |
| id        | String (unique) |
| firstname | String          |
| lastname  | String          |
| email     | String (unique) |
| password  | String          |
| createdAt | DateTime        |
| updatedAt | DateTime        |

```markdown
# Table: Movie
```

| Column      | Type            |
| ----------- | --------------- |
| id          | String (unique) |
| title       | String (unique) |
| description | String          |
| creatorId   | String          |
| createdAt   | DateTime        |
| updatedAt   | DateTime        |

```markdown
# Table: UserVote
```

| Column    | Type            |
| --------- | --------------- |
| id        | String (unique) |
| creatorId | String          |
| movieId   | String          |
| vote      | Boolean         |
| createdAt | DateTime        |
| updatedAt | DateTime        |

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
```
