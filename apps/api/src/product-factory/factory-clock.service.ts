import { Injectable } from '@nestjs/common';

@Injectable()
export class FactoryClockService {
  now() {
    return new Date().toISOString();
  }
}