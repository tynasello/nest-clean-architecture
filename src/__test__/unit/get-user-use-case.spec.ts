import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { GetUserUseCase } from '../../application/use-cases/get-user-use-case';
import { User } from '../../domain/entities/user';
import { UseCaseProxy } from '../../infrastructure/use-cases-proxy/use-cases-proxy';
import { UseCaseProxyModule } from '../../infrastructure/use-cases-proxy/use-cases-proxy.module';
import { FakeUserRepository } from '../fake-adapters/fake-user.repository';

let getUserUseCaseProxy: UseCaseProxy<GetUserUseCase>;
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

  getUserUseCaseProxy = module.get<UseCaseProxy<GetUserUseCase>>(
    UseCaseProxyModule.GET_USER_USE_CASE_PROXY,
  );
  fakeUserRepository = module.get<FakeUserRepository>(FakeUserRepository);
});

describe('Unit test for get user use case', () => {
  it('Successfully gets a user by username', async () => {
    const user = new User({
      username: 'test-username',
      password: 'test-password',
    });
    const expectedExistingUser = {
      ...user,
      id: expect.any(String),
      refreshToken: expect.any(String),
    };
    await fakeUserRepository.createUser(user);
    const existingUserOrError = await getUserUseCaseProxy
      .getInstance()
      .getUser(user.username);
    expect(existingUserOrError.isSuccess).toBe(true);
    const existingUser = existingUserOrError.getValue();
    expect(existingUser).toMatchObject(expectedExistingUser);
  });

  it('Fails to get a user with a username that does not exist', async () => {
    const nonExistentUsername = 'non-existent-username';
    const existingUserOrError = await getUserUseCaseProxy
      .getInstance()
      .getUser(nonExistentUsername);
    expect(existingUserOrError.isFailure).toBe(true);
  });
});
