import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { Injectable } from '@nestjs/common';

type DatabaseEntities = 'user';
type DatabaseFilters = any;

@Injectable()
export class DatabaseService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findUnique(
    databaseEntity: DatabaseEntities,
    filters: DatabaseFilters,
  ): Promise<any> {
    return await this.prismaService[databaseEntity].findUnique({
      where: { ...filters },
    });
  }

  public async findMany(databaseEntity: DatabaseEntities): Promise<any> {
    return await this.prismaService[databaseEntity].findMany({});
  }

  public async create(
    databaseEntity: DatabaseEntities,
    rawData: any,
  ): Promise<any> {
    return await this.prismaService[databaseEntity].create({
      data: rawData,
    });
  }

  public async update(
    databaseEntity: DatabaseEntities,
    filters: DatabaseFilters,
    rawData: any,
  ) {
    return await this.prismaService[databaseEntity].update({
      where: filters,
      data: rawData,
    });
  }
}
