import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import {
  PrismaService,
  TestPrismaService,
} from '../../infrastructure/services/prisma/prisma.service';

let app: INestApplication;
let testingModule: TestingModule;
let prismaService: PrismaService;

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useClass(TestPrismaService)
    .compile();

  prismaService = testingModule.get<PrismaService>(PrismaService);
  app = testingModule.createNestApplication();
  await app.init();
  await cleanUp();
});

const cleanUp = async () => {
  await prismaService.user.deleteMany();
};

afterAll(async () => {
  await cleanUp();
  await app.close();
  await prismaService.$disconnect();
});

beforeEach(async () => {
  await cleanUp();
});

describe('e2e test for for user controller', () => {
  it('Succesfully return a user when given valid auth tokens', async () => {
    const userSignupDto = {
      username: 'test-username',
      password: 'test-password',
    };
    const expectedUserDto = {
      id: expect.any(String),
      username: userSignupDto.username,
    };
    let accessToken: string;
    await request(app.getHttpServer())
      .post('/auth/signup-user')
      .send(userSignupDto)
      .then((res) => {
        accessToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
      });
    await request(app.getHttpServer())
      .get('/user/get-user')
      .set('accessToken', accessToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(expectedUserDto);
      });
  });
});
