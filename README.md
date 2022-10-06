# Workable assignment

## TODO

-   [x] Define requirements and functionality
-   [x] Define tech stack
-   [x] Break into subproblems
-   [x] Define DB schema
-   [x] Create & configure monorepo
-   [x] Add and configure tools to enforce code quality
-   [ ] Create minor CI/CD pipeline
-   [ ] Transform requirements to unit tests
-   [ ] Write code to satisfy tests
-   [ ] Refactor
-   [ ] Deploy
-   [ ] Write report

## Requirements and functionality

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
-   Cypress
-   Docker
-   Docker compose
-   Nginx
-   Digital ocean

## Subproblems

-   Create express server
-   Create request from backend to frontend
-   Connect & initialize DBs
-   Create register
-   Create login
-   Create session & auth middleware
-   Auth state frontend
-   Create movie form
-   Get all movies
-   Display all movies
-   Like/Hate a movie
-   Sort movies
-   View movies by user
-   Dockerize
-   Deploy

## DB Schema

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
| userId      | String (unique) |
| createdAt   | DateTime        |
| updatedAt   | DateTime        |

```markdown
# Table: UserVote
```

| Column    | Type            |
| --------- | --------------- |
| id        | String (unique) |
| userId    | String          |
| movieId   | String          |
| vote      | Boolean         |
| createdAt | DateTime        |
| updatedAt | DateTime        |
