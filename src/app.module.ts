import { UserService } from '@application/use-cases/User.service';
import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { CacheService } from '@interface-adapters/Cache.service';
import { UserController } from '@interface-adapters/controllers/User.controller';
import { UserMap } from '@interface-adapters/dal/mappers/UserMap';
import { DatabaseService } from '@interface-adapters/Database.sevice';
import { UserRepository } from '@interface-adapters/repositories/UserRepository';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 0,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/infrastructure/api/schema.gql'),
      sortSchema: true,
      installSubscriptionHandlers: true,
      // subscriptions: {
      //   'graphql-ws': true,
      // },
    }),
  ],
  providers: [
    PrismaService,
    DatabaseService,
    CacheService,
    { provide: 'BaseMapper<User>', useClass: UserMap },
    { provide: 'IUserRepository', useClass: UserRepository },
    UserService,
    UserController,
  ],
})
export class AppModule {}
