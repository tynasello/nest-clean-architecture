import { AggregateRoot } from '@domain/AggregateRoot';
import { GatewayType } from '@domain/Gateway.type';
import { IDomainEvent } from './IDomainEvent';
import { IDomainEventSubscriber } from './IDomainEventSubscriber';

type DomainEventsToSubscribersMap = {
  domainEvent: IDomainEvent;
  subscribers: IDomainEventSubscriber[];
};

export class DomainEventManager {
  private static domainEventsToSubscribersMap: DomainEventsToSubscribersMap[] =
    [];

  public static registerDomainEvent(event: IDomainEvent) {
    const eventToListenersMap = this.domainEventsToSubscribersMap.find(
      (etl) => etl.domainEvent.constructor.name === event.constructor.name,
    );
    if (!eventToListenersMap) {
      this.domainEventsToSubscribersMap.push({
        domainEvent: event,
        subscribers: [],
      });
    }
  }

  public static subscribeToDomainEvent(
    eventName: string,
    listener: IDomainEventSubscriber,
  ) {
    this.domainEventsToSubscribersMap
      .find((etl) => etl.domainEvent.constructor.name === eventName)
      ?.subscribers.push(listener);
  }

  public static unsubscribeFromDomainEvent(
    eventName: string,
    listenerName: string,
  ) {
    this.domainEventsToSubscribersMap
      .find((etl) => etl.domainEvent.constructor.name === eventName)
      ?.subscribers.filter((etl) => etl.constructor.name !== listenerName);
  }

  public static clearSubscriptionsForDomainEvent(eventName: string) {
    this.domainEventsToSubscribersMap =
      this.domainEventsToSubscribersMap.filter(
        (etl) => etl.domainEvent.constructor.name !== eventName,
      );
  }

  public static notifySubscribersOfDomainEvent(
    eventName: string,
    gateway?: GatewayType,
    aggregate?: AggregateRoot<any>,
  ) {
    const eventListenerMap = this.domainEventsToSubscribersMap.find(
      (etl) => etl.domainEvent.constructor.name === eventName,
    );

    eventListenerMap.subscribers.forEach((etl) =>
      etl.update(gateway, aggregate),
    );
  }
}
