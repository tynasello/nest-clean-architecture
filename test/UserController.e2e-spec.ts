import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import {
  PrismaService,
  TestPrismaService,
} from '@infrastructure/prisma/Prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useClass(TestPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get(PrismaService);

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    await prismaService.$queryRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  });

  afterAll(async () => {
    await app.close();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        username: 'tytest',
        password: '12345',
        profileColor: 'orange',
      };
      const expectedUserDto = {
        id: expect.any(String),
        username: createUserDto.username,
        profileColor: createUserDto.profileColor,
      };
      let accessToken: string;

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto)
        .expect(201)
        .expect(({ body }) => {
          accessToken = body.accessToken;
          expect(body).toMatchObject({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          });
        });

      await request(app.getHttpServer())
        .get('/user')
        .set('cookie', `accessToken=${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject(expectedUserDto);
        });
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return error if request dto is invalid', async () => {
      const createUserDto = {
        username: '',
        password: '12345',
        profileColor: 'orange',
      };
      const expectedResponse = {
        message: ['username should not be empty'],
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto)
        .expect(400)
        .expect(({ body }) => {
          expect(body).toMatchObject(expectedResponse);
        });
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should fallback to default profile color if request dto contains invalid one', async () => {
      const createUserDto = {
        username: 'tytest',
        password: '12345',
      };
      const expectedUserDto = {
        id: expect.any(String),
        username: createUserDto.username,
        profileColor: UserProfileColor.defaultUserProfileColor,
      };
      let accessToken: string;

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto)
        .expect(201)
        .expect(({ body }) => {
          accessToken = body.accessToken;
          expect(body).toMatchObject({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          });
        });

      await request(app.getHttpServer())
        .get('/user')
        .set('cookie', `accessToken=${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject(expectedUserDto);
        });
    });
  });
});
