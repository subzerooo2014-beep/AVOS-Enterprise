import { Injectable } from '@nestjs/common';
import { CapabilityRegistryService } from '../../avos-enterprise-runtime/capabilities/capability-registry.service';
import { RuntimePersistenceService } from '../persistence/runtime-persistence.service';

@Injectable()
export class CapabilityPersistenceBridgeService {
  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly persistence: RuntimePersistenceService,
  ) {}

  async synchronize(): Promise<{
    total: number;
    persisted: number;
  }> {
    const capabilities = this.registry.list();
    let persisted = 0;

    for (const capability of capabilities) {
      await this.persistence.save(
        'capabilities',
        'capability',
        capability.id,
        capability,
        capability.state,
      );
      persisted += 1;
    }

    return {
      total: capabilities.length,
      persisted,
    };
  }

  async restore(): Promise<number> {
    const records = await this.persistence.list(
      'capabilities',
      'capability',
    );

    for (const record of records) {
      const capability = record.payload as Parameters<
        CapabilityRegistryService['register']
      >[0];

      this.registry.register(capability);
    }

    return records.length;
  }
}