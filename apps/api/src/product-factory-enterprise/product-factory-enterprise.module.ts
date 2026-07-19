import { Module } from '@nestjs/common';
import { DeploymentGateService } from './deployment-gate.service';
import { DeploymentRuntimeService } from './deployment-runtime.service';
import { ProductDigitalTwinService } from './product-digital-twin.service';
import { ProductEcosystemService } from './product-ecosystem.service';
import { ProductEvolutionService } from './product-evolution.service';
import { ProductFactoryEnterpriseController } from './product-factory-enterprise.controller';
import { ProductFactoryEnterpriseStore } from './product-factory-enterprise.store';
import { ProductFactoryEnterpriseVerificationService } from './product-factory-enterprise-verification.service';

@Module({
  controllers: [ProductFactoryEnterpriseController],
  providers: [
    ProductFactoryEnterpriseStore,
    DeploymentGateService,
    DeploymentRuntimeService,
    ProductEvolutionService,
    ProductDigitalTwinService,
    ProductEcosystemService,
    ProductFactoryEnterpriseVerificationService,
  ],
  exports: [
    DeploymentRuntimeService,
    ProductEvolutionService,
    ProductDigitalTwinService,
    ProductEcosystemService,
  ],
})
export class ProductFactoryEnterpriseModule {}