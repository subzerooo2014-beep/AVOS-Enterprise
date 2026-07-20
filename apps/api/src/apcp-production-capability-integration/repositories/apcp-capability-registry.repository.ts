import { Injectable } from '@nestjs/common';
import { CapabilityRegistration } from '../domain/apcp-production-capability.types';

@Injectable()
export class ApcpCapabilityRegistryRepository {
  private registration: CapabilityRegistration | null = null;

  save(registration: CapabilityRegistration): CapabilityRegistration {
    this.registration = structuredClone(registration);
    return this.get()!;
  }

  get(): CapabilityRegistration | null {
    return this.registration ? structuredClone(this.registration) : null;
  }
}