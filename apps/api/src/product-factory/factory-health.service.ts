import { Injectable } from '@nestjs/common';
import { FactoryRegistryService } from './factory-registry.service';

@Injectable()
export class FactoryHealthService {
  constructor(private readonly registry: FactoryRegistryService) {}

  health() {
    return {
      status: 'healthy',
      registry: 'healthy',
      pipeline: 'healthy',
      generators: 'healthy',
      integrations: 'healthy',
      metrics: this.registry.metrics(),
      checkedAt: new Date().toISOString(),
    };
  }
}