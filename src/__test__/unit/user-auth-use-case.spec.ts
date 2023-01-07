import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { User } from 'src/domain/entities/user';
import { UseCaseProxy } from 'src/infrastructure/use-cases-proxy/use-cases-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/use-cases-proxy/use-cases-proxy.module';
import { UserAuthUseCase } from '../../application/use-cases/user-auth-use-case';
import { FakeUserRepository } from '../fake-adapters/fake-user.repository';

let userAuthUseCaseProxy: UseCaseProxy<UserAuthUseCase>;
let fakeUserRepository: FakeUserRepository;

beforeEach(async () => {
  const module = await Test.createTestingModule({
    imports: [
      UseCaseProxyModule.register({ useFakeImplementations: true }),
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ['.env'],
      }),
    ],
  }).compile();

  userAuthUseCaseProxy = module.get<UseCaseProxy<UserAuthUseCase>>(
    UseCaseProxyModule.USER_AUTH_USE_CASE_PROXY,
  );
  fakeUserRepository = module.get<FakeUserRepository>(FakeUserRepository);
});

describe('Unit test for user auth use case', () => {
  describe('User signup', () => {
    it('Successfully signs a user up', async () => {
      const user = new User({
        username: 'test-username',
        password: 'test-password',
      });
      const expectedCreatedUserAuthTokens = {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      };
      const createdUserAuthTokensOrError = await userAuthUseCaseProxy
        .getInstance()
        .signupUser(user);
      expect(createdUserAuthTokensOrError.isSuccess).toBe(true);
      const createdUserAuthTokens = createdUserAuthTokensOrError.getValue();
      expect(createdUserAuthTokens).toMatchObject(
        expectedCreatedUserAuthTokens,
      );
    });

    it('Fails to signup a user with a username that already exists', async () => {
      const user = new User({
        username: 'test-username',
        password: 'test-password',
      });
      await fakeUserRepository.createUser(user);
      const createdUserAuthTokensOrError = await userAuthUseCaseProxy
        .getInstance()
        .signupUser(user);
      expect(createdUserAuthTokensOrError.isFailure).toBe(true);
    });
  });
});
