import { Injectable } from '@nestjs/common';
import { FactoryBuildRequest } from './product-factory.types';

@Injectable()
export class ProductTemplatesIntegrationService {
  inspect(request: FactoryBuildRequest) {
    return {
      integration: 'Product Templates',
      key: 'product-templates',
      status: 'connected',
      mode: 'templates',
      requestedCapabilities: request.capabilities,
      requestedIntegrations: request.integrations,
      productName: request.productName,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      inspectedAt: new Date().toISOString(),
    };
  }
}