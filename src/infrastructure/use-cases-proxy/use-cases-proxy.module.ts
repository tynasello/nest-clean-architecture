import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthUseCase } from 'src/application/use-cases/auth-use-case';
import { GetUserUseCase } from 'src/application/use-cases/get-user-use-case';
import { RepositoriesModule } from '../repositories/repositories.module';
import { UserRepository } from '../repositories/user/user.repository';
import { AuthTokenModule } from '../services/auth-token/auth-token.module';
import { AuthTokenService } from '../services/auth-token/auth-token.service';
import { HashModule } from '../services/hash/hash.module';
import { HashService } from '../services/hash/hash.service';
import { UseCaseProxy } from './use-cases-proxy';

@Module({
  imports: [RepositoriesModule, HashModule, AuthTokenModule],
})
export class UseCaseProxyModule {
  static SIGNUP_USE_CASE_PROXY = 'SIGNUP_USE_CASE_PROXY';
  static GET_USER_USE_CASE_PROXY = 'GET_USER_USE_CASE_PROXY';

  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        {
          inject: [
            ConfigService,
            UserRepository,
            HashService,
            AuthTokenService,
          ],
          provide: UseCaseProxyModule.SIGNUP_USE_CASE_PROXY,
          useFactory: (
            configService: ConfigService,
            userRepository: UserRepository,
            hashService: HashService,
            authTokenService: AuthTokenService,
          ) =>
            new UseCaseProxy(
              new AuthUseCase(
                configService,
                userRepository,
                hashService,
                authTokenService,
              ),
            ),
        },
        {
          inject: [UserRepository],
          provide: UseCaseProxyModule.GET_USER_USE_CASE_PROXY,
          useFactory: (userRepository: UserRepository) =>
            new UseCaseProxy(new GetUserUseCase(userRepository)),
        },
      ],
      exports: [
        UseCaseProxyModule.SIGNUP_USE_CASE_PROXY,
        UseCaseProxyModule.GET_USER_USE_CASE_PROXY,
      ],
    };
  }
}
