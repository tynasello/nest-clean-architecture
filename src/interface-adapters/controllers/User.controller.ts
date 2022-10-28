import { BaseController } from '@application/logic/BaseController';
import { UserService } from '@application/use-cases/User.service';
import { CachingInterceptor } from '@interface-adapters/interceptors/Caching.interceptor';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';

@UseInterceptors(CachingInterceptor)
@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('all')
  public async getUsers(): Promise<any> {
    const result = await this.userService.getUsers();
    return this.handleResult(result);
  }

  @Get('byId/:userId')
  public async getUserById(@Param('userId') userId: string): Promise<any> {
    const result = await this.userService.getUserById(userId);
    return this.handleResult(result);
  }

  @Post('create')
  public async createUser(@Body() createUserDto: any): Promise<any> {
    const result = await this.userService.createUser(createUserDto);
    return this.handleResult(result);
  }
}
