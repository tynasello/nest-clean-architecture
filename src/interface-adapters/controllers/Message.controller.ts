import { CreateMessageRequestDto } from '@application/contracts/dtos/message/CreateMessage.request.dto';
import { MessageResponseDto } from '@application/contracts/dtos/message/Message.response.dto';
import { MessageHistoryResponseDto } from '@application/contracts/dtos/message/MessageHistory.response.dto';
import { MessageHistoryWithContactRequestDto } from '@application/contracts/dtos/message/MessageHistoryWithContact.request.dto';
import { BaseController } from '@application/logic/BaseController';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { MessageService } from '@application/use-cases/Message.service';
import { Message } from '@domain/entities/Message';
import { GetUserFromReq } from '@interface-adapters/controllers/decorators/GetUserFromReq.decorator';
import { AccessTokenGuard } from '@interface-adapters/controllers/guards/AccessToken.guard';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CachingInterceptor } from './interceptors/Caching.interceptor';

@Controller('message')
export class MessageController extends BaseController {
  constructor(
    private readonly messageService: MessageService,
    @Inject('BaseMapper<Message>')
    private readonly messageMap: BaseMapper<Message>,
  ) {
    super();
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  @Post('create')
  @UseGuards(AccessTokenGuard)
  public async createMessage(
    @GetUserFromReq('username') senderUsername: string,
    @Body() createMessageDto: CreateMessageRequestDto,
  ): Promise<any> {
    let messageOrError = await this.messageService.createMessage(
      senderUsername,
      createMessageDto,
    );
    messageOrError = messageOrError.isSuccess
      ? Result.ok(this.messageMap.domainToDTO(messageOrError.getValue()))
      : Result.fail(messageOrError.getError());
    return this.handleResult(messageOrError);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  @Get('messageHistoryWithContact')
  @UseInterceptors(CachingInterceptor)
  @UseGuards(AccessTokenGuard)
  public async getMessageHistoryWithContact(
    @GetUserFromReq('username') username: string,
    @Body()
    messageHistoryWithContactRequestDto: MessageHistoryWithContactRequestDto,
  ): Promise<any> {
    const { contactUsername } = messageHistoryWithContactRequestDto;

    const messageHistoryOrError =
      await this.messageService.getMessageHistoryWithContact(
        username,
        contactUsername,
      );

    if (messageHistoryOrError.isFailure)
      return this.handleResult(Result.fail(messageHistoryOrError.getError()));

    const { sentMessages, receivedMessages } = messageHistoryOrError.getValue();

    const sentMessagesDto = sentMessages.map((message) =>
      this.messageMap.domainToDTO(message),
    ) as MessageResponseDto[];

    const receivedMessagesDto = receivedMessages.map((message) =>
      this.messageMap.domainToDTO(message),
    ) as MessageResponseDto[];

    const messageHistoryDto = MessageHistoryResponseDto.create({
      sentMessages: sentMessagesDto,
      receivedMessages: receivedMessagesDto,
    });

    return this.handleResult(Result.ok(messageHistoryDto));
  }
}
