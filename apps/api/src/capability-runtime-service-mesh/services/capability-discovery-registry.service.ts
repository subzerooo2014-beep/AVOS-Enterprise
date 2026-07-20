import { Injectable, OnModuleInit } from '@nestjs/common';
import { CapabilityDescriptor } from '../domain/capability-runtime.types';
import { CapabilityRegistryRepository } from '../repositories/capability-registry.repository';

@Injectable()
export class CapabilityDiscoveryRegistryService implements OnModuleInit {
  constructor(
    private readonly registry: CapabilityRegistryRepository,
  ) {}

  onModuleInit(): void {
    const seeds: Array<
      Omit<CapabilityDescriptor, 'registeredAt' | 'updatedAt'>
    > = [
      {
        id: 'avos.factory',
        name: 'AVOS Factory',
        version: '1.0.0',
        category: 'software-production',
        state: 'operational',
        dependencies: ['avos.foundation'],
        permissions: [
          'capability.discover',
          'capability.execute',
          'event.publish',
        ],
        metadata: { seeded: true, foundationFirst: true },
      },
      {
        id: 'avos.apcp.production-certification',
        name: 'AVOS APCP Production Certification',
        version: 'APCP-PCI-1.0.0',
        category: 'production-certification',
        endpoint: '/avos/apcp-production-capability',
        state: 'operational',
        dependencies: ['avos.foundation', 'avos.factory'],
        permissions: [
          'capability.discover',
          'certification.evaluate',
          'deployment.authorize',
          'event.publish',
        ],
        metadata: {
          seeded: true,
          humanFinalAuthority: true,
          globalComplianceReadinessGate: true,
        },
      },
      {
        id: 'avos.knowledge-fabric',
        name: 'AVOS Knowledge Fabric',
        version: 'KF-6',
        category: 'knowledge',
        state: 'operational',
        dependencies: ['avos.foundation'],
        permissions: [
          'capability.discover',
          'knowledge.read',
          'knowledge.write',
          'event.publish',
        ],
        metadata: { seeded: true },
      },
      {
        id: 'avos.intelligence-fabric',
        name: 'AVOS Intelligence Fabric',
        version: 'IF-6',
        category: 'intelligence',
        state: 'operational',
        dependencies: [
          'avos.foundation',
          'avos.knowledge-fabric',
        ],
        permissions: [
          'capability.discover',
          'intelligence.execute',
          'event.publish',
        ],
        metadata: {
          seeded: true,
          humanFinalAuthority: true,
        },
      },
      {
        id: 'avos.foundation',
        name: 'AVOS Foundation',
        version: 'FPI-UCP-1.0.0',
        category: 'foundation',
        state: 'operational',
        dependencies: [],
        permissions: [
          'capability.discover',
          'capability.register',
          'policy.enforce',
          'event.publish',
        ],
        metadata: {
          seeded: true,
          stableCoreArchitecture: true,
        },
      },
    ];

    for (const seed of seeds) {
      if (!this.registry.get(seed.id)) {
        this.register(seed);
      }
    }
  }

  register(
    input: Omit<CapabilityDescriptor, 'registeredAt' | 'updatedAt'>,
  ): CapabilityDescriptor {
    const now = new Date().toISOString();
    return this.registry.save({
      ...input,
      registeredAt: now,
      updatedAt: now,
    });
  }

  update(
    id: string,
    patch: Partial<
      Omit<CapabilityDescriptor, 'id' | 'registeredAt'>
    >,
  ): CapabilityDescriptor {
    const current = this.registry.get(id);
    if (!current) {
      throw new Error(`Capability not found: ${id}`);
    }

    return this.registry.save({
      ...current,
      ...patch,
      id,
      registeredAt: current.registeredAt,
      updatedAt: new Date().toISOString(),
    });
  }

  get(id: string): CapabilityDescriptor | null {
    return this.registry.get(id);
  }

  list(): CapabilityDescriptor[] {
    return this.registry.list();
  }
}