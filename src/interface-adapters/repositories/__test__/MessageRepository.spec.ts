import { BaseMapper } from '@application/logic/BaseMapper';
import { Message } from '@domain/entities/Message';
import {
  DomainEventEnum,
  DomainEventManager,
} from '@domain/events/DomainEventManager';
import { PrismaService } from '@infrastructure/prisma/Prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageRepository } from '../Message.repository';

describe('MessageRepository', () => {
  let messageRepository: MessageRepository;
  let prismaService: PrismaService;
  let domainEventManager: DomainEventManager;
  let messageMap: BaseMapper<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageRepository,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
            message: { create: jest.fn() },
          },
        },
        {
          provide: DomainEventManager,
          useValue: { fireDomainEvent: jest.fn() },
        },
        {
          provide: 'BaseMapper<Message>',
          useValue: {
            persistanceToDomain: jest.fn(),
            domainToPersistence: jest.fn(),
          },
        },
      ],
    }).compile();

    messageRepository = module.get<MessageRepository>(MessageRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    domainEventManager = module.get<DomainEventManager>(DomainEventManager);
    messageMap = module.get<BaseMapper<Message>>('BaseMapper<Message>');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should be defined', () => {
    expect(messageRepository).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(domainEventManager).toBeDefined();
    expect(messageMap).toBeDefined();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('create', () => {
    it('should create message and fire message created domain event', async () => {
      const message = {
        props: {
          receiver: { props: { id: 'id' } },
          sender: { props: { id: 'id' } },
        },
      } as any;

      const createdMessage = 'createdMessage' as any;

      jest
        .spyOn(prismaService.message, 'create')
        .mockReturnValue(createdMessage);
      jest
        .spyOn(messageMap, 'persistanceToDomain')
        .mockImplementation((x) => x);

      expect(await messageRepository.create(message)).toBe(createdMessage);
      expect(domainEventManager.fireDomainEvent).toBeCalledWith(
        DomainEventEnum.MESSAGE_CREATED_EVENT,
        { message: createdMessage },
      );
    });
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('getMessageHistoryWithContact', () => {
    it('should return sent and received messages between username and contactId', async () => {
      const user = {
        sentMessages: ['sentMessage'],
        receivedMessages: ['receivedMessage'],
      } as any;
      jest.spyOn(prismaService.user, 'findUnique').mockReturnValue(user);
      jest
        .spyOn(messageMap, 'persistanceToDomain')
        .mockImplementation((x) => x);
      expect(
        await messageRepository.getMessageHistoryWithContact(
          'username',
          'contactId',
        ),
      ).toStrictEqual(user);
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return empty message objects between username and contactId if no messages exist', async () => {
      const user = {
        sentMessages: [],
        receivedMessages: [],
      } as any;
      jest.spyOn(prismaService.user, 'findUnique').mockReturnValue(user);
      jest
        .spyOn(messageMap, 'persistanceToDomain')
        .mockImplementation((x) => x);
      expect(
        await messageRepository.getMessageHistoryWithContact(
          'username',
          'contactId',
        ),
      ).toStrictEqual(user);
    });
  });
});
