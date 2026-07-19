import { Injectable } from '@nestjs/common';

@Injectable()
export class FactoryIdService {
  create(prefix: string) {
    return `${prefix}:${Date.now()}:${Math.random().toString(16).slice(2)}`;
  }
}