import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { Message } from '@domain/entities/Message';
import { MessageRepository } from '@interface-adapters/repositories/Message.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from '../Message.service';
import { UserService } from '../User.service';

describe('MessageService', () => {
  let messageService: MessageService;
  let userService: UserService;
  let messageRepository: MessageRepository;
  let messageMap: BaseMapper<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: UserService,
          useValue: {
            getUserByUsername: jest.fn(),
          },
        },
        {
          provide: 'IMessageRepository',
          useValue: {
            create: jest.fn(),
            getMessageHistoryWithContact: jest.fn(),
          },
        },
        {
          provide: 'BaseMapper<Message>',
          useValue: { dtoToDomain: jest.fn() },
        },
      ],
    }).compile();

    messageService = module.get<MessageService>(MessageService);
    userService = module.get<UserService>(UserService);
    messageRepository = module.get<MessageRepository>('IMessageRepository');
    messageMap = module.get<BaseMapper<Message>>('BaseMapper<Message>');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should be defined', () => {
    expect(messageService).toBeDefined();
    expect(userService).toBeDefined();
    expect(messageRepository).toBeDefined();
    expect(messageMap).toBeDefined();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('createMessage', () => {
    it('should return successful result with created message', async () => {
      const createdMessage = 'createdMessage' as any;
      jest
        .spyOn(messageMap, 'dtoToDomain')
        .mockReturnValue(Result.ok(createdMessage));
      jest.spyOn(messageRepository, 'create').mockReturnValue(createdMessage);

      expect(
        (
          await messageService.createMessage(
            'senderUsername',
            'createMessageDto' as any,
          )
        ).getValue(),
      ).toBe(createdMessage);
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return failed result when message cannot be created', async () => {
      const expectedError = 'expectedError' as any;
      jest
        .spyOn(messageMap, 'dtoToDomain')
        .mockReturnValue(Result.fail(expectedError));

      expect(
        (
          await messageService.createMessage(
            'senderUsername',
            'createMessageDto' as any,
          )
        ).getError(),
      ).toBe(expectedError);
    });
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('getMessageHistoryWithContact', () => {
    it('should return successful result with message history', async () => {
      const contactUser = { props: { id: { value: 'id' } } } as any;
      const messageHistory = 'messageHistory' as any;
      jest
        .spyOn(userService, 'getUserByUsername')
        .mockReturnValue(Result.ok(contactUser) as any);
      jest
        .spyOn(messageRepository, 'getMessageHistoryWithContact')
        .mockReturnValue(messageHistory);

      expect(
        (
          await messageService.getMessageHistoryWithContact(
            'senderUsername',
            'createMessageDto' as any,
          )
        ).getValue(),
      ).toBe(messageHistory);
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return failed result when message history cannot be retrieved', async () => {
      const expectedError = 'expectedError' as any;
      jest
        .spyOn(userService, 'getUserByUsername')
        .mockReturnValue(Result.fail(expectedError) as any);

      expect(
        (
          await messageService.getMessageHistoryWithContact(
            'username',
            'contactUsername',
          )
        ).getError(),
      ).toBe(expectedError);
    });
  });
});
