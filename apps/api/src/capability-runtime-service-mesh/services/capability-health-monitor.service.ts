import { Injectable } from '@nestjs/common';
import {
  CapabilityDescriptor,
  CapabilityHealth,
} from '../domain/capability-runtime.types';
import { CapabilityHealthRepository } from '../repositories/capability-health.repository';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';

@Injectable()
export class CapabilityHealthMonitorService {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
    private readonly healthRepository: CapabilityHealthRepository,
  ) {}

  check(capabilityId: string): CapabilityHealth {
    const capability = this.discovery.get(capabilityId);
    if (!capability) {
      throw new Error(`Capability not found: ${capabilityId}`);
    }

    const result = this.evaluate(capability);
    return this.healthRepository.save(result);
  }

  checkAll(): CapabilityHealth[] {
    return this.discovery.list().map((capability) =>
      this.healthRepository.save(this.evaluate(capability)),
    );
  }

  summary(): {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
    score: number;
  } {
    const checks = this.checkAll();
    const total = checks.length;
    const healthy = checks.filter(
      (item) => item.state === 'healthy',
    ).length;
    const degraded = checks.filter(
      (item) => item.state === 'degraded',
    ).length;
    const unhealthy = checks.filter(
      (item) => item.state === 'unhealthy',
    ).length;

    const score =
      total === 0
        ? 0
        : Math.round(
            checks.reduce((sum, item) => sum + item.score, 0) /
              total,
          );

    return { total, healthy, degraded, unhealthy, score };
  }

  private evaluate(
    capability: CapabilityDescriptor,
  ): CapabilityHealth {
    const details: string[] = [];
    let score = 100;

    if (
      capability.state === 'failed' ||
      capability.state === 'stopped'
    ) {
      score = 0;
      details.push(`state:${capability.state}`);
    } else if (
      capability.state === 'degraded' ||
      capability.state === 'updating'
    ) {
      score = 75;
      details.push(`state:${capability.state}`);
    } else {
      details.push('runtime-state-ok');
    }

    return {
      capabilityId: capability.id,
      state:
        score >= 90
          ? 'healthy'
          : score >= 60
            ? 'degraded'
            : 'unhealthy',
      score,
      latencyMs: 1,
      checkedAt: new Date().toISOString(),
      details,
    };
  }
}