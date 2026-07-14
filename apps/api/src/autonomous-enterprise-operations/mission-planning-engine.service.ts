import { Injectable } from '@nestjs/common';
import {
  EnterpriseMission,
  ResourcePool,
} from './autonomous-enterprise-operations.types';

@Injectable()
export class MissionPlanningEngineService {
  plan(
    mission: EnterpriseMission,
    resources: ResourcePool[],
  ): {
    mission: EnterpriseMission;
    requiredCapacity: number;
    availableCapacity: number;
    feasible: boolean;
    actions: string[];
  } {
    const availableCapacity = resources.reduce(
      (sum, resource) =>
        sum + Math.max(0, resource.available - resource.committed),
      0,
    );
    const requiredCapacity = Math.max(
      1,
      mission.requiredCapabilities.length * 10 + mission.dependencies.length * 5,
    );

    return {
      mission: {
        ...mission,
        status: availableCapacity >= requiredCapacity ? 'ready' : 'blocked',
      },
      requiredCapacity,
      availableCapacity,
      feasible: availableCapacity >= requiredCapacity,
      actions: mission.requiredCapabilities.map(
        (capability) => `activate:${capability}`,
      ),
    };
  }
}