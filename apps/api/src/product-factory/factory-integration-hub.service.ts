import { Injectable } from '@nestjs/common';
import { FactoryBuildRequest, IntegrationSnapshot } from './product-factory.types';
import { CapabilityFabricIntegrationService } from './capability-fabric-integration.service';
import { KnowledgeFabricIntegrationService } from './knowledge-fabric-integration.service';
import { IntelligenceFabricIntegrationService } from './intelligence-fabric-integration.service';
import { MarketplaceIntegrationService } from './marketplace-integration.service';
import { ProductTemplatesIntegrationService } from './product-templates-integration.service';
import { EnterpriseKernelIntegrationService } from './enterprise-kernel-integration.service';

@Injectable()
export class FactoryIntegrationHubService {
  constructor(
    private readonly capabilityFabric: CapabilityFabricIntegrationService,
    private readonly knowledgeFabric: KnowledgeFabricIntegrationService,
    private readonly intelligenceFabric: IntelligenceFabricIntegrationService,
    private readonly marketplace: MarketplaceIntegrationService,
    private readonly productTemplates: ProductTemplatesIntegrationService,
    private readonly enterpriseKernel: EnterpriseKernelIntegrationService,
  ) {}

  inspect(request: FactoryBuildRequest): IntegrationSnapshot {
    return {
      capabilityFabric: this.capabilityFabric.inspect(request),
      knowledgeFabric: this.knowledgeFabric.inspect(request),
      intelligenceFabric: this.intelligenceFabric.inspect(request),
      marketplace: this.marketplace.inspect(request),
      productTemplates: this.productTemplates.inspect(request),
      enterpriseKernel: this.enterpriseKernel.inspect(request),
    };
  }
}