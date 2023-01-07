import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { User } from '../../domain/entities/user';
import { CUSTOM_ERRORS } from '../../domain/errors/custom-errors';
import { RepositoriesModule } from '../../infrastructure/repositories/repositories.module';
import { UserRepository } from '../../infrastructure/repositories/user/user.repository';
import {
  PrismaService,
  TestPrismaService,
} from '../../infrastructure/services/prisma/prisma.service';

let userRepository: UserRepository;
let prismaService: PrismaService;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      RepositoriesModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ['.env'],
      }),
    ],
  })
    .overrideProvider(PrismaService)
    .useClass(TestPrismaService)
    .compile();
  userRepository = module.get<UserRepository>(UserRepository);
  prismaService = module.get<PrismaService>(PrismaService);
  await cleanUp();
});

const cleanUp = async () => {
  await prismaService.user.deleteMany();
};

afterAll(async () => {
  await cleanUp();
  await prismaService.$disconnect();
});

beforeEach(async () => {
  await cleanUp();
});

describe('Integration test for user repository', () => {
  describe('Creating a user', () => {
    it('Successfully creates a user', async () => {
      const user = new User({
        username: 'test-username',
        password: 'test-password',
      });
      const expectedCreatedUser = {
        ...user,
        id: expect.any(String),
        refreshToken: null,
      };
      const createdUserOrError = await userRepository.createUser(user);
      expect(createdUserOrError.isSuccess).toBe(true);
      const createdUser = createdUserOrError.getValue();
      expect(createdUser).toMatchObject(expectedCreatedUser);
    });

    it('Fails to create a user with invalid props', async () => {
      const expectedCreatedUserError = {
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: expect.any(String),
      };
      const createdUserOrError = await userRepository.createUser({} as any);
      expect(createdUserOrError.isFailure).toBe(true);
      const createdUserError = createdUserOrError.getError();
      expect(createdUserError).toMatchObject(expectedCreatedUserError);
    });

    it('Fails to create a user with a username that already exists', async () => {
      const user = new User({
        username: 'test-username',
        password: 'test-password',
      });
      const expectedCreatedUserError = {
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: expect.any(String),
      };
      await userRepository.createUser(user);
      const createdUserOrError = await userRepository.createUser(user);
      expect(createdUserOrError.isFailure).toBe(true);
      const createdUserError = createdUserOrError.getError();
      expect(createdUserError).toMatchObject(expectedCreatedUserError);
    });
  });

  describe('Getting a user', () => {
    it('Succesfully gets a user', async () => {
      const user = new User({
        username: 'test-username',
        password: 'test-password',
      });
      const expectedCreatedUser = {
        ...user,
        id: expect.any(String),
        refreshToken: null,
      };
      await userRepository.createUser(user);
      const createdUserOrError = await userRepository.getUserByUsername(
        user.username,
      );
      expect(createdUserOrError.isSuccess).toBe(true);
      const createdUser = createdUserOrError.getValue();
      expect(createdUser).toMatchObject(expectedCreatedUser);
    });

    it('Fails to get a user from a username that does not exist', async () => {
      const nonExistentUsername = 'non-existent-username';
      const expectedExistingUserError = {
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: expect.any(String),
      };
      const existingUserOrError = await userRepository.getUserByUsername(
        nonExistentUsername,
      );
      expect(existingUserOrError.isFailure).toBe(true);
      const existingUserError = existingUserOrError.getError();
      expect(existingUserError).toMatchObject(expectedExistingUserError);
    });
  });

  describe("Upserting a user's refresh token", () => {
    it("Succesfully upserts a user's refresh token", async () => {
      const user = new User({
        username: 'test-username',
        password: 'test-password',
      });
      const refreshToken = 'user-refresh-token';
      await userRepository.createUser(user);
      const updatedUserOrError = await userRepository.upsertRefreshToken(
        user.username,
        refreshToken,
      );
      expect(updatedUserOrError.isSuccess).toBe(true);
      const updatedUser = updatedUserOrError.getValue();
      expect(updatedUser).toMatchObject({ refreshToken: refreshToken });
    });

    it('Fails to upsert a refresh token to a user that does not exist', async () => {
      const invalidUsername = 'invalid-username';
      const refreshToken = 'user-refresh-token';
      const expectedUpdatedUserError = {
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: expect.any(String),
      };
      const updatedUserOrError = await userRepository.upsertRefreshToken(
        invalidUsername,
        refreshToken,
      );
      expect(updatedUserOrError.isFailure).toBe(true);
      const updatedUserError = updatedUserOrError.getError();
      expect(updatedUserError).toMatchObject(expectedUpdatedUserError);
    });
  });
});
