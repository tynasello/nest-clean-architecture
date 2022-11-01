import { User } from '@domain/aggregates/User';
import { DomainEventManager } from '@domain/events/DomainEventManager';
import { IDomainEventSubscriber } from '@domain/events/IDomainEventSubscriber';
import { UserCreatedEvent } from '@domain/events/UserCreatedEvent';

export class OnUserCreatedEventLogUsersSubscriber
  implements IDomainEventSubscriber
{
  constructor() {
    DomainEventManager.subscribeToDomainEvent(UserCreatedEvent.name, this);
  }

  public update(user?: User) {
    console.log('-- New user created --');
    user && console.log(user);
  }
}
