export class UseCaseProxy<T> {
  constructor(private readonly _useCase: T) {}
  getInstance(): T {
    return this._useCase;
  }
}
