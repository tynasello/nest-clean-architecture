import { IDomainEventSubscriber } from '@domain/interfaces/IDomainEventSubscriber';
import { ILogMessageSubscriber } from '@domain/interfaces/subscribers/ILogMessageSubscriber';
import { ILogUserSubscriber } from '@domain/interfaces/subscribers/ILogUserSubscriber';
import { Inject, Injectable } from '@nestjs/common';

export enum DomainEventEnum {
  USER_CREATED_EVENT = 'USER_CREATED_EVENT',
  MESSAGE_CREATED_EVENT = 'MESSAGE_CREATED_EVENT',
}

type DomainEventsToSubscribersMap = {
  domainEvent: DomainEventEnum;
  subscribers: IDomainEventSubscriber[];
};

@Injectable()
export class DomainEventManager {
  constructor(
    @Inject('ILogUserSubscriber')
    private readonly logUserSubscriber: ILogUserSubscriber,

    @Inject('ILogMessageSubscriber')
    private readonly logMessageSubscriber: ILogMessageSubscriber,
  ) {}

  private readonly domainEventsToSubscribersMap: DomainEventsToSubscribersMap[] =
    [
      {
        domainEvent: DomainEventEnum.USER_CREATED_EVENT,
        subscribers: [this.logUserSubscriber],
      },
      {
        domainEvent: DomainEventEnum.MESSAGE_CREATED_EVENT,
        subscribers: [this.logMessageSubscriber],
      },
    ];

  public fireDomainEvent(event: DomainEventEnum, payload: any) {
    const subscribersOfDomainEvent = this.domainEventsToSubscribersMap.find(
      (a) => a.domainEvent === event,
    ).subscribers;

    subscribersOfDomainEvent.forEach((subscriber) =>
      subscriber.update(event, payload),
    );
  }
}
