## Clean Architecture API Template in NestJS

Features:
- API leveraging Clean architecture adhering to DDD principles.
- User authentication using JWTs.
    - Tokens stored in HttpOnly cookies.
    - Automatic attempts server-side to refresh expired access tokens.
- Domain events over web sockets (Socket.io) using observer pattern.
- Endpoint caching using Redis.
- Designed with the intent to decouple services; easy to switch databases, third party libraries/services, etc.
- Flexible error handling: no need to purposefully throw errors and have numerous try-catch blocks.
- Uses repository pattern.

Current State:
- User and Message tables in database.
- CRUD/authentication-related (login, sign-up, refresh tokens, logout) endpoints for User domain entity.
- Endpoints protected using JWTs.
- Endpoint to create a message emits domain event over web sockets to receiving user.
- Unit tests exist for certain parts of code base.

Tools Used:
- NestJS
- Prisma
- PostgreSQL
- Jest
- Redis
- Socket.io
- JWT

Project Structure

- Database scheme [here](src/infrastructure/db/prisma/schema.prisma).

- [File Structure](./file-structure.md)