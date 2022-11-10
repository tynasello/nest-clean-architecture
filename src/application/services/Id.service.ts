import { v4 as uuid } from 'uuid';

export class IdService {
  public static newId(): string {
    return uuid();
  }

  public static isValidId(field: string): boolean {
    const isValidIdRegexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return !!field && isValidIdRegexExp.test(field);
  }
}
