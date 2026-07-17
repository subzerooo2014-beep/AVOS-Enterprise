import { Injectable } from '@nestjs/common';
import { CapabilityRegistryService } from '../capabilities/capability-registry.service';
import { RuntimeHealthStatus } from '../contracts/runtime.contracts';

@Injectable()
export class RuntimeHealthService {
  constructor(private readonly registry: CapabilityRegistryService) {}

  snapshot(): {
    status: RuntimeHealthStatus;
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
    unknown: number;
  } {
    const capabilities = this.registry.list();
    const counts = {
      healthy: capabilities.filter((item) => item.health === 'healthy').length,
      degraded: capabilities.filter((item) => item.health === 'degraded').length,
      unhealthy: capabilities.filter((item) => item.health === 'unhealthy').length,
      unknown: capabilities.filter((item) => item.health === 'unknown').length,
    };

    let status: RuntimeHealthStatus = 'healthy';
    if (counts.unhealthy > 0) status = 'unhealthy';
    else if (counts.degraded > 0 || counts.unknown > 0) status = 'degraded';

    return {
      status,
      total: capabilities.length,
      ...counts,
    };
  }
}