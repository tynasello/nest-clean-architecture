## Clean (Monolithic) Architecture in NestJS

A template for a monolithic application that follows the Clean Architecture design philosophy and is written in TypeScript using the NestJS framework.

### How Clean Architecture is Implemented:

The project is broken up into the following layers: domain, application, and infrastructure. The domain is the most inner and important layer in the architecture. It contains the high-level business rules of the application and has no dependencies on other layers or services. The application layer is only dependent on the domain layer. It contains all the application-specific business rules like the business use cases. It also declares interfaces for external services that it will depend on. The infrastructure layer contains any necessary adapters to convert data between external services and the use cases. This layer must also implement all interfaces defined in the application layer. The infrastructure layer contains no business logic and has dependencies on all other layers. The infrastructure layer also contains all the application's low-level details like database tools.

Throughout the architecture, SOLID design principles are practiced, especially the dependency inversion principle and the separation of concerns principle. The NestJS module system allows for easy separation of concerns amongst the applications services/use cases. Following the dependency inversion principle alongside using the built-in NestJS dependency injection solutions allow the Clean Architectures dependency rule to be followed. The dependency rule states that inner layers should not have dependencies on outer layers. This leads to loose coupling in the architecture and is what provides so many benefits to using Clean Architecture. One of which is the ability to easily interchange external services (like a database) with others, without affecting the rest of the application.

### Current State:

- The application, which contains a NestJS API and PostgreSQL databases, is developed using docker and docker-compose.
- The database contains the User and Message tables which are managed through Prisma.
- REST controllers and use cases exist for authentication-related tasks as well as for creating and reading users and messages.
- Endpoints are protected using JSON Web Tokens. Controller guards authenticate users and automatically attempt to refresh invalid access tokens.
- Web sockets are configured to “emit events” like a _new message created_. Web sockets are also protected using JWTs.
- The endpoints and DTOs needed to make valid requests can be found in src/infrastructure/rest/controllers/ and src/infrastructure/rest/dtos/, respectively.
- End-to-end, integration, and unit tests exist across the application.
- External services (ORM, hashing service, authentication token service) are isolated in individual modules in the infrastructure layer.
- Flexible error handling exists through a _Result_ class that limits the need for multiple try-catch blocks.
- The repository pattern is leveraged to follow the DRY principle and to have increased testability in the application where persistence is of concern.

### How Authentication is Handled:

When a user is signed up or logged in, two JSON Web Tokens are created and stored in HTTP-only cookies (via an API interceptor). The first token is an access token that expires quickly, the second is a refresh token that is valid for a longer amount of time and is persisted in the user table in a database. The access token is used to access protected endpoints and when it expires, a user can use their refresh token to acquire a new access token. A new valid access token will only be returned to a user if the persisted refresh token for that user matches their inputted refresh token. When a user logs out, their refresh token will be removed from the database. Subsequently, when their access token expires, they will be unable to refresh it. At this point, they must log in again to become authenticated.

To protect endpoints, the passport strategy is used to verify authentication tokens. This is achieved through a controller guard that only proceeds with a request if the passed-in access token is valid. If the access token is valid but expired, the guard will automatically retrieve the refresh token from the request cookies and attempt to create a new access token using it. If the user is still not authenticated, a 401 is thrown.

### How Testing is Done:

Unit tests focus on the use cases of the application. The applications use cases run with fake implementations of providers which cause side effects, such as the ORM. Integration tests both focus on the integration of modules with the rest of the application and on testing the real implementation of the providers which were faked in the unit tests. End-to-end tests target the entire application and test responses of endpoints. E2E and integration tests utilize a test database (with the same schema as the development database) when needed.

### Getting Started:

- To start services in development run: `docker-compose up`. This will build and pull the necessary images and start the NestJS API (localhost:3000), and the PostgreSQL development and test databases. The URIs to these databases are dependent on your .env file. For example, my development database URI is `postgresql://dev-username:dev-password@dev-db:5432/dev-db?schema=public`
- To configure the databases using the Prisma schema and to run database migrations run: `npm run migrate`.
- To run tests run one of the following: `npm run test:e2e` (end-to-end tests), `npm run test:integration` (integration tests), or `npm run test:unit` (unit tests).

### REST Endpoints:

- `POST auth/signup-user`

- `POST auth/login-user`

- `POST auth/logout-user`

- `GET user/get-user`

- `POST message/create-message`

- `GET message/get-message-history-with-username`
