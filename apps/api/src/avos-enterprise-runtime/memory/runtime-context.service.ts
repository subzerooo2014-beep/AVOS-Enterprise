import { Injectable } from '@nestjs/common';
import { RuntimeMemoryService } from './runtime-memory.service';

@Injectable()
export class RuntimeContextService {
  constructor(private readonly memory: RuntimeMemoryService) {}

  build(input: {
    tenantId?: string;
    userId?: string;
    capabilityId?: string;
    correlationId?: string;
    data?: Record<string, unknown>;
  }): Record<string, unknown> {
    const capabilityMemory = input.capabilityId
      ? this.memory.list(`capability:${input.capabilityId}`)
      : [];

    return {
      ...input,
      capabilityMemory,
      builtAt: new Date().toISOString(),
    };
  }
}