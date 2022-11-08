import { LogUserSubscriber } from '@interface-adapters/domain-event-subscribers/LogUser.subscriber';
import { Injectable } from '@nestjs/common';
import { IDomainEventSubscriber } from './IDomainEventSubscriber';

export enum DomainEvent {
  USER_CREATED_EVENT = 'USER_CREATED_EVENT',
}

type DomainEventsToSubscribersMap = {
  domainEvent: DomainEvent;
  subscribers: IDomainEventSubscriber[];
};

@Injectable()
export class DomainEventManager {
  constructor(private readonly logUserSubscriber: LogUserSubscriber) {}

  private domainEventsToSubscribersMap: DomainEventsToSubscribersMap[] = [
    {
      domainEvent: DomainEvent.USER_CREATED_EVENT,
      subscribers: [this.logUserSubscriber],
    },
  ];

  public fireDomainEvent(event: DomainEvent, payload?: any) {
    const subscribers = this.domainEventsToSubscribersMap.find(
      (a) => a.domainEvent === event,
    ).subscribers;

    subscribers.forEach((subscriber) => subscriber.update(event, payload));
  }
}
