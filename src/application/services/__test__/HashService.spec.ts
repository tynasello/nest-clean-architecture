import { HashService } from '@application/services/Hash.service';

describe('HashService', () => {
  it('should create a hash', () => {
    expect(typeof HashService.hash('field')).toBe('string');
  });

  it('should properly compare a field with its hashed field', () => {
    const field = 'field';
    const hashedField = HashService.hash(field);
    expect(HashService.compare(field, hashedField)).toBe(true);
  });

  it('should properly compare a field with a hashed field that is not its own', () => {
    const field = 'field';
    const hashedField = HashService.hash('otherField');
    expect(HashService.compare(field, hashedField)).toBe(false);
  });
});
