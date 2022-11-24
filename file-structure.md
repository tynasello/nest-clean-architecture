```
├── src
│   ├── app.module.ts
│   ├── application
│   │   ├── contracts
│   │   │   ├── data-mappers
│   │   │   │   ├── DataMapper.module.ts
│   │   │   │   ├── MessageMap.ts
│   │   │   │   ├── UserMap.ts
│   │   │   │   └── __test__
│   │   │   │       └── UserMap.spec.ts
│   │   │   └── dtos
│   │   │       ├── message
│   │   │       │   ├── CreateMessage.request.dto.ts
│   │   │       │   ├── Message.response.dto.ts
│   │   │       │   ├── MessageHistory.response.dto.ts
│   │   │       │   ├── MessageHistory.ts
│   │   │       │   └── MessageHistoryWithContact.request.dto.ts
│   │   │       └── user
│   │   │           ├── AuthTokens.response.dto.ts
│   │   │           ├── AuthTokens.ts
│   │   │           ├── LoginUser.request.dto.ts
│   │   │           ├── RefreshAccessToken.request.dto.ts
│   │   │           ├── SignupUser.request.dto.ts
│   │   │           ├── UpdateUser.request.dto.ts
│   │   │           └── User.response.dto.ts
│   │   ├── logic
│   │   │   ├── BaseController.ts
│   │   │   ├── BaseMapper.ts
│   │   │   ├── GuardProps.ts
│   │   │   ├── Result.ts
│   │   │   └── __test__
│   │   │       ├── BaseController.spec.ts
│   │   │       ├── GuardProps.spec.ts
│   │   │       └── Result.spec.ts
│   │   ├── services
│   │   │   ├── AuthToken.service.ts
│   │   │   ├── Cache.service.ts
│   │   │   ├── Hash.service.ts
│   │   │   ├── Id.service.ts
│   │   │   ├── Services.module.ts
│   │   │   └── __test__
│   │   │       ├── HashService.spec.ts
│   │   │       └── IdService.spec.ts
│   │   └── use-cases
│   │       ├── Auth.service.ts
│   │       ├── Message.service.ts
│   │       ├── UseCases.module.ts
│   │       ├── User.service.ts
│   │       └── __test__
│   │           └── MessageService.spec.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── Message.ts
│   │   │   └── User.ts
│   │   ├── errors
│   │   │   └── CustomErrors.ts
│   │   ├── events
│   │   │   ├── DomainEventManager.ts
│   │   │   └── __test__
│   │   │       └── DomainEventManager.spec.ts
│   │   ├── interfaces
│   │   │   ├── IDomainEventSubscriber.ts
│   │   │   ├── IRepository.ts
│   │   │   ├── gateways
│   │   │   │   ├── IMessageGateway.ts
│   │   │   │   └── IUserGateway.ts
│   │   │   ├── repositories
│   │   │   │   ├── IMessageRepository.ts
│   │   │   │   └── IUserRepository.ts
│   │   │   └── subscribers
│   │   │       ├── ILogMessageSubscriber.ts
│   │   │       └── ILogUserSubscriber.ts
│   │   ├── primitives
│   │   │   ├── AggregateRoot.ts
│   │   │   ├── Entity.ts
│   │   │   └── ValueObject.ts
│   │   └── value-objects
│   │       ├── Id.ts
│   │       ├── __test__
│   │       │   ├── MessageContent.spec.ts
│   │       │   └── UserPassword.spec.ts
│   │       ├── message
│   │       │   └── MessageContent.ts
│   │       └── user
│   │           ├── UserPassword.ts
│   │           ├── UserProfileColor.ts
│   │           └── UserUsername.ts
│   ├── infrastructure
│   │   └── db
│   │       └── prisma
│   │           ├── Prisma.service.ts
│   │           ├── migrations
│   │           │   ├── 20221025231242_init
│   │           │   │   └── migration.sql
│   │           │   ├── 20221103170009_add_refresh_token_to_user_table
│   │           │   │   └── migration.sql
│   │           │   ├── 20221110160255_add_message_table
│   │           │   │   └── migration.sql
│   │           │   └── migration_lock.toml
│   │           └── schema.prisma
│   ├── interface-adapters
│   │   ├── auth-strategies
│   │   │   ├── accessToken.strategy.ts
│   │   │   └── refreshToken.strategy.ts
│   │   ├── controllers
│   │   │   ├── Auth.controller.ts
│   │   │   ├── Message.controller.ts
│   │   │   ├── User.controller.ts
│   │   │   ├── __test__
│   │   │   │   └── MessageController.spec.ts
│   │   │   ├── decorators
│   │   │   │   └── GetUserFromReq.decorator.ts
│   │   │   ├── guards
│   │   │   │   ├── AccessToken.guard.ts
│   │   │   │   └── RefeshToken.guard.ts
│   │   │   └── interceptors
│   │   │       ├── Caching.interceptor.ts
│   │   │       └── SetCookies.interceptor.ts
│   │   ├── domain-event-subscribers
│   │   │   ├── DomainEventSubscriber.module.ts
│   │   │   ├── LogMessage.subscriber.ts
│   │   │   └── LogUser.subscriber.ts
│   │   ├── gateways
│   │   │   ├── Gateway.module.ts
│   │   │   ├── Message.gateway.ts
│   │   │   └── User.gateway.ts
│   │   └── repositories
│   │       ├── Message.repository.ts
│   │       ├── Repository.module.ts
│   │       ├── User.repository.ts
│   │       └── __test__
│   │           └── MessageRepository.spec.ts
│   └── main.ts
```