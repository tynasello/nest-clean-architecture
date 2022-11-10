import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { Injectable } from '@nestjs/common';

type DatabaseEntities = 'user' | 'message' | '';
type DatabaseFilters = any;

@Injectable()
export class DatabaseService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findOne(
    databaseEntity: DatabaseEntities,
    uniqueFilter: DatabaseFilters,
  ): Promise<any> {
    return await this.prismaService[databaseEntity].findUnique({
      where: { ...uniqueFilter },
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

  public async updateMany(
    databaseEntity: DatabaseEntities,
    filters: DatabaseFilters,
    rawData: any,
  ): Promise<any> {
    return await this.prismaService[databaseEntity].update({
      where: filters,
      data: rawData,
    });
  }

  public async deleteMany(
    databaseEntity: DatabaseEntities,
    filters: DatabaseFilters,
  ): Promise<any> {
    return await this.prismaService[databaseEntity].deleteMany({
      where: filters,
    });
  }
}
