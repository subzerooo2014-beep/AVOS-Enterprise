import { Injectable } from '@nestjs/common';
import { CapabilityPermissionDecision } from '../domain/capability-runtime.types';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';

@Injectable()
export class CapabilityPermissionsService {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
  ) {}

  evaluate(
    capabilityId: string,
    permission: string,
  ): CapabilityPermissionDecision {
    const capability = this.discovery.get(capabilityId);

    if (!capability) {
      return {
        capabilityId,
        permission,
        allowed: false,
        reason: 'capability-not-found',
      };
    }

    const allowed = capability.permissions.includes(permission);

    return {
      capabilityId,
      permission,
      allowed,
      reason: allowed
        ? 'permission-granted'
        : 'permission-not-declared',
    };
  }
}