import { Injectable } from '@nestjs/common';
import { CapabilityDescriptor } from '../domain/capability-runtime.types';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';
import { CapabilityLifecycleManagerService } from './capability-lifecycle-manager.service';
import { CapabilityDependencyGraphService } from './capability-dependency-graph.service';

@Injectable()
export class DynamicCapabilityLoaderService {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
    private readonly lifecycle: CapabilityLifecycleManagerService,
    private readonly dependencies: CapabilityDependencyGraphService,
  ) {}

  load(
    input: Omit<CapabilityDescriptor, 'registeredAt' | 'updatedAt'>,
  ): {
    loaded: boolean;
    capability: CapabilityDescriptor;
    dependencyValidation: ReturnType<
      CapabilityDependencyGraphService['validate']
    >;
  } {
    const capability = this.discovery.register({
      ...input,
      state: 'loading',
    });

    const dependencyValidation = this.dependencies.validate();

    if (!dependencyValidation.valid) {
      return {
        loaded: false,
        capability: this.lifecycle.transition(
          capability.id,
          'failed',
        ),
        dependencyValidation,
      };
    }

    return {
      loaded: true,
      capability: this.lifecycle.transition(
        capability.id,
        'operational',
      ),
      dependencyValidation,
    };
  }
}