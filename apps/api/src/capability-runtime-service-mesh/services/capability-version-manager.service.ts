import { Injectable } from '@nestjs/common';
import { CapabilityVersionRepository } from '../repositories/capability-version.repository';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';

@Injectable()
export class CapabilityVersionManagerService {
  constructor(
    private readonly versions: CapabilityVersionRepository,
    private readonly discovery: CapabilityDiscoveryRegistryService,
  ) {}

  initialize(capabilityId: string) {
    const capability = this.discovery.get(capabilityId);
    if (!capability) {
      throw new Error(`Capability not found: ${capabilityId}`);
    }

    if (!this.versions.active(capabilityId)) {
      this.versions.add({
        capabilityId,
        version: capability.version,
        active: true,
        deployedAt: new Date().toISOString(),
      });
    }

    return this.versions.list(capabilityId);
  }

  activate(capabilityId: string, version: string) {
    const capability = this.discovery.get(capabilityId);
    if (!capability) {
      throw new Error(`Capability not found: ${capabilityId}`);
    }

    const active = this.versions.active(capabilityId);

    const record = this.versions.add({
      capabilityId,
      version,
      previousVersion: active?.version ?? capability.version,
      active: true,
      deployedAt: new Date().toISOString(),
    });

    this.discovery.update(capabilityId, { version });

    return record;
  }

  history(capabilityId: string) {
    this.initialize(capabilityId);
    return this.versions.list(capabilityId);
  }
}