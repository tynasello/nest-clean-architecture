import { DomainEventEnum } from '@domain/events/DomainEventManager';
import { IUserGateway } from '@domain/interfaces/gateways/IUserGateway';
import { ILogUserSubscriber } from '@domain/interfaces/subscribers/ILogUserSubscriber';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LogUserSubscriber implements ILogUserSubscriber {
  constructor(
    @Inject('IUserGateway') private readonly userGateway: IUserGateway,
  ) {}

  public update(domainEvent: DomainEventEnum, payload: any) {
    const user = payload?.user;
    this.userGateway.emitUserCreated(domainEvent, user);
  }
}
