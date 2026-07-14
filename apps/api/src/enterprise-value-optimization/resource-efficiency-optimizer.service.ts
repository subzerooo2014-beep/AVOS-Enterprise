import { Injectable } from '@nestjs/common';
import { ResourceUsage } from './enterprise-value-optimization.types';

@Injectable()
export class ResourceEfficiencyOptimizerService {
  optimize(resources: ResourceUsage[]) {
    const analysis = resources.map((resource) => {
      const utilization =
        resource.capacity === 0
          ? 0
          : Math.max(
              0,
              Math.min(100, (resource.used / resource.capacity) * 100),
            );
      const unusedCapacity = Math.max(
        0,
        resource.capacity - resource.used,
      );
      const avoidableCost =
        resource.capacity === 0
          ? 0
          : resource.cost * (unusedCapacity / resource.capacity);

      return {
        ...resource,
        utilization: Math.round(utilization),
        unusedCapacity,
        avoidableCost: Math.round(avoidableCost),
      };
    });

    return {
      resources: analysis,
      averageUtilization: Math.round(
        analysis.reduce((sum, item) => sum + item.utilization, 0) /
          Math.max(1, analysis.length),
      ),
      totalAvoidableCost: analysis.reduce(
        (sum, item) => sum + item.avoidableCost,
        0,
      ),
    };
  }
}