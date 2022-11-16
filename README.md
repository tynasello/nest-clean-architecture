## Clean Architecture Template in NestJS

Features:
- Clean architecture adhering to DDD principles.
- User authentication using JWTs and HttpOnly cookies.
- Domain events over web sockets (Socket.io) using observer pattern.
- Endpoint caching using Redis.
- Designed with the intent to decouple services; easy to switch databases, third party libraries/services, etc.
- Flexible error handling: no need for numerous try-catch blocks.
- Uses repository pattern.

Current State:
- User and Message tables in database.
- CRUD/authentication-related (login, sign-up, refresh tokens, logout) endpoints for User domain entity.
- Endpoints protected using JWTs
- Endpoint to create a message emits domain event over web sockets to receiving user.

Tools Used:
- NestJS
- Prisma
- PostgreSQL
- Redis
- Socket.io
- JWT

Project Structure

- Database scheme [here](src/infrastructure/db/prisma/schema.prisma).

```
├── src
│   ├── app.module.ts
│   ├── application
│   │   ├── contracts
│   │   │   ├── data-mappers
│   │   │   │   ├── MessageMap.ts
│   │   │   │   └── UserMap.ts
│   │   │   └── dtos
│   │   │       ├── message
│   │   │       │   ├── CreateMessage.request.dto.ts
│   │   │       │   ├── Message.response.dto.ts
│   │   │       │   ├── MessageHistory.response.dto.ts
│   │   │       │   ├── MessageHistory.ts
│   │   │       │   └── MessageHistoryWithContact.request.dto.ts
│   │   │       └── user
│   │   │           ├── AuthTokens.response.dto.ts
│   │   │           ├── AuthTokens.ts
│   │   │           ├── LoginUser.request.dto.ts
│   │   │           ├── RefreshAccessToken.request.dto.ts
│   │   │           ├── SignupUser.request.dto.ts
│   │   │           ├── UpdateUser.request.dto.ts
│   │   │           └── User.response.dto.ts
│   │   ├── logic
│   │   │   ├── BaseController.ts
│   │   │   ├── BaseMapper.ts
│   │   │   ├── Guard.ts
│   │   │   └── Result.ts
│   │   ├── services
│   │   │   ├── AuthToken.service.ts
│   │   │   ├── Cache.service.ts
│   │   │   ├── Hash.service.ts
│   │   │   ├── Id.service.ts
│   │   │   └── Services.module.ts
│   │   └── use-cases
│   │       ├── Auth.service.ts
│   │       ├── Message.service.ts
│   │       ├── UseCases.module.ts
│   │       └── User.service.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── Message.ts
│   │   │   └── User.ts
│   │   ├── errors
│   │   │   └── CustomErrors.ts
│   │   ├── events
│   │   │   └── DomainEventManager.ts
│   │   ├── interfaces
│   │   │   ├── IDomainEventSubscriber.ts
│   │   │   ├── IRepository.ts
│   │   │   ├── gateways
│   │   │   │   ├── IMessageGateway.ts
│   │   │   │   └── IUserGateway.ts
│   │   │   ├── repositories
│   │   │   │   ├── IMessageRepository.ts
│   │   │   │   └── IUserRepository.ts
│   │   │   └── subscribers
│   │   │       ├── ILogMessageSubscriber.ts
│   │   │       └── ILogUserSubscriber.ts
│   │   ├── primitives
│   │   │   ├── AggregateRoot.ts
│   │   │   ├── Entity.ts
│   │   │   └── ValueObject.ts
│   │   └── value-objects
│   │       ├── Id.ts
│   │       ├── message
│   │       │   └── MessageContent.ts
│   │       └── user
│   │           ├── UserPassword.ts
│   │           ├── UserProfileColor.ts
│   │           └── UserUsername.ts
│   ├── infrastructure
│   │   └── db
│   │       └── prisma
│   │           ├── Prisma.service.ts
│   │           ├── migrations
│   │           │   ├── 20221025231242_init
│   │           │   │   └── migration.sql
│   │           │   ├── 20221103170009_add_refresh_token_to_user_table
│   │           │   │   └── migration.sql
│   │           │   ├── 20221110160255_add_message_table
│   │           │   │   └── migration.sql
│   │           │   └── migration_lock.toml
│   │           └── schema.prisma
│   ├── interface-adapters
│   │   ├── auth-strategies
│   │   │   ├── accessToken.strategy.ts
│   │   │   └── refreshToken.strategy.ts
│   │   ├── controllers
│   │   │   ├── Auth.controller.ts
│   │   │   ├── Message.controller.ts
│   │   │   ├── User.controller.ts
│   │   │   ├── decorators
│   │   │   │   └── GetUserFromReq.decorator.ts
│   │   │   ├── guards
│   │   │   │   ├── AccessToken.guard.ts
│   │   │   │   └── RefeshToken.guard.ts
│   │   │   └── interceptors
│   │   │       ├── Caching.interceptor.ts
│   │   │       └── SetCookies.interceptor.ts
│   │   ├── domain-event-subscribers
│   │   │   ├── LogMessage.subscriber.ts
│   │   │   └── LogUser.subscriber.ts
│   │   ├── gateways
│   │   │   ├── Message.gateway.ts
│   │   │   └── User.gateway.ts
│   │   └── repositories
│   │       ├── Message.repository.ts
│   │       └── User.repository.ts
│   └── main.ts
```