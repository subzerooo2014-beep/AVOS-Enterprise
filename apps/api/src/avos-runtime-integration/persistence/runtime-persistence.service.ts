import { Inject, Injectable } from '@nestjs/common';
import {
  RUNTIME_PERSISTENCE_REPOSITORY,
  RuntimePersistenceRepository,
} from './runtime-persistence.repository';
import { integrationId } from '../shared/integration.utils';

@Injectable()
export class RuntimePersistenceService {
  constructor(
    @Inject(RUNTIME_PERSISTENCE_REPOSITORY)
    private readonly repository: RuntimePersistenceRepository,
  ) {}

  save(
    namespace: string,
    type: string,
    key: string,
    payload: unknown,
    status = 'active',
  ) {
    return this.repository.upsert({
      id: integrationId('record'),
      namespace,
      type,
      key,
      payload,
      version: 1,
      status,
    });
  }

  list(namespace: string, type?: string) {
    return this.repository.find(namespace, type);
  }

  get(namespace: string, key: string) {
    return this.repository.findOne(namespace, key);
  }

  remove(namespace: string, key: string) {
    return this.repository.remove(namespace, key);
  }

  count(namespace?: string) {
    return this.repository.count(namespace);
  }

  health() {
    return this.repository.health();
  }
}