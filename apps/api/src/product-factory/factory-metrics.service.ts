import { Injectable } from '@nestjs/common';
import { FactoryRegistryService } from './factory-registry.service';

@Injectable()
export class FactoryMetricsService {
  constructor(private readonly registry: FactoryRegistryService) {}

  snapshot() {
    return {
      ...this.registry.metrics(),
      timestamp: new Date().toISOString(),
    };
  }
}