import { IdService } from '@application/services/Id.service';

describe('IdService', () => {
  it('should create a valid id', () => {
    const id = IdService.newId();
    expect(typeof id).toBe('string');
    expect(IdService.isValidId(id)).toBe(true);
  });

  it('should properly validate valid id', () => {
    const validId = '7d0341e8-5b08-4be4-8c02-73a8bf712d92';
    expect(IdService.isValidId(validId)).toBe(true);
  });

  it('should properly validate invalid id', () => {
    const invalidId = '7d0341e8-5b08-4be4-8c02';
    expect(IdService.isValidId(invalidId)).toBe(false);
  });

  it('should properly validate null id', () => {
    const invalidId = null;
    expect(IdService.isValidId(invalidId)).toBe(false);
  });
});
