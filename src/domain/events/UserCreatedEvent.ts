import { OnUserCreatedEventLogUsersSubscriber } from '@interface-adapters/domain-event-listeners/OnUserCreatedEventLogUsersSubscriber';
import { IDomainEvent } from './IDomainEvent';

export class UserCreatedEvent implements IDomainEvent {
  public setupDomainEventSubscriptions() {
    new OnUserCreatedEventLogUsersSubscriber();
  }
}
