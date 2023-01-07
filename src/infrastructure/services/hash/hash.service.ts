import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { IHashService } from '../../../application/interfaces/hash-service.interface';

@Injectable()
export class HashService implements IHashService {
  public hash(field: string): string {
    return createHash('md5').update(field).digest('hex');
  }

  public compare(field: string, hashedField: string): boolean {
    return createHash('md5').update(field).digest('hex') === hashedField;
  }
}
