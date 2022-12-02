import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DEV_DATABASE_URL,
        },
      },
    });
  }
}

export class TestPrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL,
        },
      },
    });
  }
}
