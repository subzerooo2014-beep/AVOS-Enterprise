import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CapabilityDescriptor } from '../contracts/runtime.contracts';
import { CapabilityRegistryService } from './capability-registry.service';

interface FutureManifestCapability {
  group: string;
  capability: string;
  className?: string;
  route?: string;
}

interface FutureManifest {
  version?: string;
  capabilities: FutureManifestCapability[];
}

@Injectable()
export class CapabilityDiscoveryService {
  constructor(private readonly registry: CapabilityRegistryService) {}

  discoverFromManifest(manifestPath?: string): CapabilityDescriptor[] {
    const resolvedPath =
      manifestPath ??
      join(
        process.cwd(),
        'src',
        'avos-future-platform',
        'future-platform.manifest.json',
      );

    const manifest = JSON.parse(
      readFileSync(resolvedPath, 'utf8'),
    ) as FutureManifest;

    const registered = this.registry.registerMany(
      manifest.capabilities.map((item) => ({
        id: item.capability,
        name: item.className ?? item.capability,
        group: item.group,
        version: manifest.version ?? '1.0.0',
        route: item.route,
        dependencies: [],
        policies: [
          'human-authority',
          'audit-by-design',
          'rollback-required',
        ],
        tags: [item.group, 'future-platform'],
        state: 'registered' as const,
        health: 'unknown' as const,
        metadata: {
          source: 'future-platform.manifest.json',
        },
      })),
    );

    return registered;
  }
}