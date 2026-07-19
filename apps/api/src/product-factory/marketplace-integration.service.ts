import { Injectable } from '@nestjs/common';
import { FactoryBuildRequest } from './product-factory.types';

@Injectable()
export class MarketplaceIntegrationService {
  inspect(request: FactoryBuildRequest) {
    return {
      integration: 'Marketplace',
      key: 'marketplace',
      status: 'connected',
      mode: 'catalog',
      requestedCapabilities: request.capabilities,
      requestedIntegrations: request.integrations,
      productName: request.productName,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      inspectedAt: new Date().toISOString(),
    };
  }
}