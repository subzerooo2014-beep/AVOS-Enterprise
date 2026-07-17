import { Injectable, Logger, Optional } from '@nestjs/common';
import { KernelRegistration } from '../contracts/integration.contracts';
import { RuntimePersistenceService } from '../persistence/runtime-persistence.service';

interface KernelRegistryLike {
  register?(input: unknown): unknown | Promise<unknown>;
  list?(): unknown[] | Promise<unknown[]>;
}

@Injectable()
export class EnterpriseKernelBridgeService {
  private readonly logger = new Logger(
    EnterpriseKernelBridgeService.name,
  );
  private readonly local = new Map<string, KernelRegistration>();

  constructor(
    private readonly persistence: RuntimePersistenceService,
    @Optional() private readonly kernelRegistry?: KernelRegistryLike,
  ) {}

  async register(
    registration: KernelRegistration,
  ): Promise<KernelRegistration> {
    this.local.set(registration.id, structuredClone(registration));

    if (this.kernelRegistry?.register) {
      await this.kernelRegistry.register(registration);
    }

    await this.persistence.save(
      'kernel',
      registration.type,
      registration.id,
      registration,
      'registered',
    );

    return structuredClone(registration);
  }

  async registerRuntimeFoundation(): Promise<KernelRegistration[]> {
    const registrations: KernelRegistration[] = [
      {
        id: 'avos-enterprise-runtime',
        type: 'service',
        version: '1.0.1',
        owner: 'enterprise-kernel',
        dependencies: [],
        metadata: {
          lifecycle: 'managed',
          health: 'observable',
        },
      },
      {
        id: 'avos-runtime-integration',
        type: 'adapter',
        version: '1.0.0',
        owner: 'enterprise-kernel',
        dependencies: ['avos-enterprise-runtime'],
        metadata: {
          persistence: 'hybrid',
          eventBridge: true,
        },
      },
      {
        id: 'runtime-event-bridge',
        type: 'transport',
        version: '1.0.0',
        owner: 'enterprise-kernel',
        dependencies: ['avos-enterprise-runtime'],
        metadata: {
          fallback: 'local-event-bus',
        },
      },
    ];

    for (const registration of registrations) {
      await this.register(registration);
    }

    this.logger.log(
      `Registered ${registrations.length} runtime foundation components`,
    );

    return registrations;
  }

  list(): KernelRegistration[] {
    return [...this.local.values()].map((item) =>
      structuredClone(item),
    );
  }

  count(): number {
    return this.local.size;
  }

  mode(): 'native' | 'adapter' {
    return this.kernelRegistry?.register ? 'native' : 'adapter';
  }
}