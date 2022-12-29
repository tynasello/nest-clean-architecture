import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserAuthUseCase } from 'src/application/use-cases/user-auth-use-case';
import { GetUserUseCase } from 'src/application/use-cases/get-user-use-case';
import { FakeUserRepository } from 'src/__test__/fake-adapters/fake-user.repository';
import { RepositoriesModule } from '../repositories/repositories.module';
import { UserRepository } from '../repositories/user/user.repository';
import { AuthTokenModule } from '../services/auth-token/auth-token.module';
import { AuthTokenService } from '../services/auth-token/auth-token.service';
import { HashModule } from '../services/hash/hash.module';
import { HashService } from '../services/hash/hash.service';
import { UseCaseProxy } from './use-cases-proxy';
import { MessageRepository } from '../repositories/message/message.repository';
import { CreateMessageUseCase } from 'src/application/use-cases/create-message-use-case';
import { GetMessageHistoryWithUsernameUseCase } from 'src/application/use-cases/get-message-history-with-username.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RepositoriesModule,
    HashModule,
    AuthTokenModule,
  ],
})
export class UseCaseProxyModule {
  static USER_AUTH_USE_CASE_PROXY = 'USER_AUTH_USE_CASE_PROXY';
  static GET_USER_USE_CASE_PROXY = 'GET_USER_USE_CASE_PROXY';
  static CREATE_MESSAGE_USE_CASE_PROXY = 'CREATE_MESSAGE_USE_CASE_PROXY';
  static GET_MESSAGE_HISTORY_WITH_USERNAME_USE_CASE_PROXY =
    'GET_MESSAGE_HISTORY_WITH_USERNAME_USE_CASE_PROXY';

  static register(useFakeAdapters?: boolean): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        {
          inject: [
            ConfigService,
            UserRepository,
            FakeUserRepository,
            HashService,
            AuthTokenService,
          ],
          provide: UseCaseProxyModule.USER_AUTH_USE_CASE_PROXY,
          useFactory: (
            configService: ConfigService,
            userRepository: UserRepository,
            fakeUserRepository: FakeUserRepository,
            hashService: HashService,
            authTokenService: AuthTokenService,
          ) =>
            new UseCaseProxy(
              new UserAuthUseCase(
                configService,
                useFakeAdapters ? fakeUserRepository : userRepository,
                hashService,
                authTokenService,
              ),
            ),
        },
        {
          inject: [UserRepository, FakeUserRepository],
          provide: UseCaseProxyModule.GET_USER_USE_CASE_PROXY,
          useFactory: (
            userRepository: UserRepository,
            fakeUserRepository: FakeUserRepository,
          ) =>
            new UseCaseProxy(
              new GetUserUseCase(
                useFakeAdapters ? fakeUserRepository : userRepository,
              ),
            ),
        },
        {
          inject: [MessageRepository, UserRepository],
          provide: UseCaseProxyModule.CREATE_MESSAGE_USE_CASE_PROXY,
          useFactory: (
            messageRepository: MessageRepository,
            userRepository: UserRepository,
          ) =>
            new UseCaseProxy(
              new CreateMessageUseCase(messageRepository, userRepository),
            ),
        },
        {
          inject: [MessageRepository, UserRepository],
          provide:
            UseCaseProxyModule.GET_MESSAGE_HISTORY_WITH_USERNAME_USE_CASE_PROXY,
          useFactory: (
            messageRepository: MessageRepository,
            userRepository: UserRepository,
          ) =>
            new UseCaseProxy(
              new GetMessageHistoryWithUsernameUseCase(
                messageRepository,
                userRepository,
              ),
            ),
        },
      ],
      exports: [
        UseCaseProxyModule.USER_AUTH_USE_CASE_PROXY,
        UseCaseProxyModule.GET_USER_USE_CASE_PROXY,
        UseCaseProxyModule.CREATE_MESSAGE_USE_CASE_PROXY,
        UseCaseProxyModule.GET_MESSAGE_HISTORY_WITH_USERNAME_USE_CASE_PROXY,
      ],
    };
  }
}
