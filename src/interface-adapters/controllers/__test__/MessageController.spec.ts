import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { CacheService } from '@application/services/Cache.service';
import { MessageService } from '@application/use-cases/Message.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Message } from '@prisma/client';
import { CachingInterceptor } from '../interceptors/Caching.interceptor';
import { MessageController } from '../Message.controller';

describe('MessageController', () => {
  let messageController: MessageController;
  let messageService: MessageService;
  let messageMap: BaseMapper<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageController,
        { provide: CacheService, useValue: {} },
        { provide: CachingInterceptor, useValue: {} },
        {
          provide: MessageService,
          useValue: {
            createMessage: jest.fn(),
            getMessageHistoryWithContact: jest.fn(),
          },
        },
        {
          provide: 'BaseMapper<Message>',
          useValue: {
            domainToDTO: jest.fn(),
          },
        },
      ],
    }).compile();

    messageController = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
    messageMap = module.get<BaseMapper<Message>>('BaseMapper<Message>');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should be defined', () => {
    expect(messageController).toBeDefined();
    expect(messageService).toBeDefined();
    expect(messageMap).toBeDefined();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('createMessage', () => {
    it('should return message dto', async () => {
      const createdMessage = 'createdMessage';
      jest
        .spyOn(messageService, 'createMessage')
        .mockReturnValue(Result.ok(createdMessage) as any);
      jest.spyOn(messageMap, 'domainToDTO').mockImplementation((x) => x);

      expect(
        await messageController.createMessage(
          'senderUsername',
          'createMessageDto' as any,
        ),
      ).toBe(createdMessage);
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should call handleResult with failed result error if no message can be created', async () => {
      const failedResult = Result.fail({} as any) as any;
      jest.spyOn(messageService, 'createMessage').mockReturnValue(failedResult);

      jest.spyOn(messageController, 'handleResult').mockImplementation();

      await messageController.createMessage(
        'senderUsername',
        'createMessageDto' as any,
      );
      expect(messageController.handleResult).toBeCalledWith(failedResult);
    });
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('getMessageHistoryWithContact', () => {
    it('should return message history dto', async () => {
      const messageHistoryWithContactRequestDto = {
        contactUsername: 'contactUsername',
      };
      const expectedMessageHistory = {
        sentMessages: [],
        receivedMessages: [],
      } as any;

      jest
        .spyOn(messageService, 'getMessageHistoryWithContact')
        .mockReturnValue(Result.ok(expectedMessageHistory) as any);
      jest.spyOn(messageMap, 'domainToDTO').mockImplementation((x) => x);

      expect(
        await messageController.getMessageHistoryWithContact(
          'username',
          messageHistoryWithContactRequestDto,
        ),
      ).toMatchObject(expectedMessageHistory);
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should call handleResult with failed result if cant get message history', async () => {
      const failedResult = Result.fail({} as any) as any;
      jest
        .spyOn(messageService, 'getMessageHistoryWithContact')
        .mockReturnValue(failedResult);

      jest.spyOn(messageController, 'handleResult').mockImplementation();
      jest.spyOn(messageMap, 'domainToDTO').mockImplementation((x) => x);

      await messageController.getMessageHistoryWithContact(
        'senderUsername',
        'createMessageDto' as any,
      );
      expect(messageController.handleResult).toBeCalledWith(failedResult);
    });
  });
});
