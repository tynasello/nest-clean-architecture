import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { Injectable } from '@nestjs/common';

type databaseEntities = 'user';
type databaseFilters = any;

@Injectable()
export class DatabaseService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findUnique(
    databaseEntity: databaseEntities,
    filters: databaseFilters,
  ): Promise<any> {
    return await this.prismaService[databaseEntity].findUnique({
      where: { ...filters },
    });
  }

  public async findMany(databaseEntity: databaseEntities): Promise<any> {
    return await this.prismaService[databaseEntity].findMany({});
  }

  public async create(
    databaseEntity: databaseEntities,
    rawData: any,
  ): Promise<any> {
    return await this.prismaService[databaseEntity].create({
      data: rawData,
    });
  }
}
