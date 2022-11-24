import {
  DomainEventEnum,
  DomainEventManager,
} from '@domain/events/DomainEventManager';
import { ILogMessageSubscriber } from '@domain/interfaces/subscribers/ILogMessageSubscriber';
import { ILogUserSubscriber } from '@domain/interfaces/subscribers/ILogUserSubscriber';
import { Test, TestingModule } from '@nestjs/testing';

describe('DomainEventManager', () => {
  let domainEventManager: DomainEventManager;
  let logMessageSubscriber: ILogMessageSubscriber;
  let logUserSubscriber: ILogUserSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainEventManager,
        { provide: 'ILogUserSubscriber', useValue: { update: jest.fn() } },
        { provide: 'ILogMessageSubscriber', useValue: { update: jest.fn() } },
      ],
    }).compile();

    domainEventManager = module.get<DomainEventManager>(DomainEventManager);
    logMessageSubscriber = module.get<ILogMessageSubscriber>(
      'ILogMessageSubscriber',
    );
    logUserSubscriber = module.get<ILogUserSubscriber>('ILogUserSubscriber');
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should be defined', () => {
    expect(domainEventManager).toBeDefined();
    expect(logMessageSubscriber).toBeDefined();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should call update method for all subscribers of inputted domain event', () => {
    const payload = 'payload';
    const event = DomainEventEnum.MESSAGE_CREATED_EVENT;
    domainEventManager.fireDomainEvent(event, payload);
    expect(logMessageSubscriber.update).toHaveBeenCalled();
    expect(logMessageSubscriber.update).toHaveBeenCalledWith(event, payload);
    expect(logUserSubscriber.update).not.toHaveBeenCalled();
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should not call update method for any subscribers not of inputted domain event', () => {
    domainEventManager.fireDomainEvent(
      DomainEventEnum.MESSAGE_CREATED_EVENT,
      'payload',
    );
    expect(logUserSubscriber.update).not.toHaveBeenCalled();
  });
});
