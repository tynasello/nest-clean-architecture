import * as bcrypt from 'bcryptjs';

export class HashService {
  public static async hash(field: string) {
    return await bcrypt.hash(field, 10);
  }

  public static async compare(field: string, hashedField: string) {
    return await bcrypt.compare(field, hashedField);
  }
}
