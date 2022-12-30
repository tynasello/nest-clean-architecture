# Clean (Monolithic) Architecture in NestJS

#### How Clean Architecture is Implemented:

#### Current State:

- The project (NestJS API and PostgreSQL databases) are developed using docker and docker-compose.
- User and Message tables exist in the Postgres database.
- REST controllers and use cases exist to create and read users and messages.
- User authentication exists to protect endpoints using JWTs, and sign up, login, logout and refresh access tokens for a user.
- Access tokens are automatically refreshed if they’re expired using refresh tokens and NestJS guards.
- Web sockets configured (using NestJS WebSockets) to “emit events” such as a newly created message and it’s corresponding payload. These gateways are also protected using JWTs.
- The endpoints, and DTOs needed to make requests can be found in src/infrastructure/rest/controllers/ and src/infrastructure/rest/dtos/, respectively.

#### How Authentication is Handled:

#### How Testing is Done:

#### Getting Started:

- To start services in development run: `docker-compose up`. This will start the NestJS API (localhost:3000), and the PostgreSQL development and test databases.
  The URI’s to these databases are dependent on your .env file. For example my development database URI is: `postgresql://dev-username:dev-password@dev-db:5432/dev-db?schema=public`
- To configure databases using the project’s prisma schema and database migrations run: `npm run migrate`.
