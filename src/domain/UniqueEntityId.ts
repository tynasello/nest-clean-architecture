import { IdService } from '@application/logic/Id.service';

export class UniqueEntityId {
  value: string;

  constructor(id?: string) {
    this.value = IdService.isValidId(id) ? id : IdService.newId();
  }
}
