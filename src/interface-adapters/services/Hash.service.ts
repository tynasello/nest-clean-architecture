import { createHash } from 'crypto';

export class HashService {
  public static hash(field: string) {
    return createHash('md5').update(field).digest('hex');
  }

  public static compare(field: string, hashedField: string) {
    return createHash('md5').update(field).digest('hex') == hashedField;
  }
}
