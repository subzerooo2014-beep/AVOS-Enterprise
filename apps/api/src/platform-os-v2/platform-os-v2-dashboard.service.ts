import { Injectable } from '@nestjs/common';
import {
  PLATFORM_OS_V2_CAPABILITIES,
  PlatformOsDashboardSnapshot,
} from './platform-os-v2.types';

@Injectable()
export class PlatformOsV2DashboardService {
  snapshot(
    input: Partial<PlatformOsDashboardSnapshot> = {},
  ): PlatformOsDashboardSnapshot {
    const clamp = (value: number) =>
      Math.max(0, Math.min(100, Math.round(value)));

    return {
      generatedAt: new Date().toISOString(),
      registeredCapabilities:
        input.registeredCapabilities ??
        PLATFORM_OS_V2_CAPABILITIES.length,
      activeModules: Math.max(0, input.activeModules ?? 0),
      activePlugins: Math.max(0, input.activePlugins ?? 0),
      activeExtensions: Math.max(0, input.activeExtensions ?? 0),
      healthyComponents: Math.max(0, input.healthyComponents ?? 0),
      automationRate: clamp(input.automationRate ?? 100),
      governanceScore: clamp(input.governanceScore ?? 100),
      platformScore: clamp(input.platformScore ?? 100),
      capabilityStatus: Object.fromEntries(
        PLATFORM_OS_V2_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as PlatformOsDashboardSnapshot['capabilityStatus'],
    };
  }
}