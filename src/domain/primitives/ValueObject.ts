export class ValueObject<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }
}
