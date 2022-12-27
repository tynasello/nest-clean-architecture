export interface IHashService {
  hash(field: string): string;
  compare(field: string, hashedField: string): boolean;
}
