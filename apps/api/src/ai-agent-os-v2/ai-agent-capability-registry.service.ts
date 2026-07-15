import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AiAgentCapabilityBaseService } from './ai-agent-capability-base.service';


const SERVICE_TYPES = {

} as const;

type RegisteredCapability = keyof typeof SERVICE_TYPES;

@Injectable()
export class AiAgentCapabilityRegistryService {
  constructor(private readonly moduleRef: ModuleRef) {}

  capabilities(): RegisteredCapability[] {
    return Object.keys(SERVICE_TYPES) as RegisteredCapability[];
  }

  resolve(capability: string): AiAgentCapabilityBaseService {
    if (!(capability in SERVICE_TYPES)) {
      throw new Error('Unknown capability: ' + capability);
    }

    const key = capability as RegisteredCapability;
    return this.moduleRef.get(SERVICE_TYPES[key], { strict: false });
  }

  health() {
    return this.capabilities().map((capability) =>
      this.resolve(capability).health(),
    );
  }
}