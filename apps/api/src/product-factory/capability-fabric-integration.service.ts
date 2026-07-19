import { Injectable } from '@nestjs/common';
import { FactoryBuildRequest } from './product-factory.types';

@Injectable()
export class CapabilityFabricIntegrationService {
  inspect(request: FactoryBuildRequest) {
    return {
      integration: 'Capability Fabric',
      key: 'capability-fabric',
      status: 'connected',
      mode: 'capabilities',
      requestedCapabilities: request.capabilities,
      requestedIntegrations: request.integrations,
      productName: request.productName,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      inspectedAt: new Date().toISOString(),
    };
  }
}