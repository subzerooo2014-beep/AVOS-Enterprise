import { Module } from "@nestjs/common";
import { DigitalIdentityController } from "./digital-identity.controller";
import { IdentityAuditService } from "./services/identity-audit.service";
import { IdentityCertificationService } from "./services/identity-certification.service";
import { IdentityGovernanceService } from "./services/identity-governance.service";
import { IdentityGraphService } from "./services/identity-graph.service";
import { IdentityHealthService } from "./services/identity-health.service";
import { IdentityIntelligenceService } from "./services/identity-intelligence.service";
import { IdentityRegistryService } from "./services/identity-registry.service";

@Module({
  controllers: [DigitalIdentityController],
  providers: [IdentityAuditService, IdentityRegistryService, IdentityGraphService, IdentityGovernanceService, IdentityIntelligenceService, IdentityHealthService, IdentityCertificationService],
  exports: [IdentityRegistryService, IdentityGraphService, IdentityGovernanceService, IdentityIntelligenceService, IdentityHealthService, IdentityCertificationService],
})
export class DigitalIdentityModule {}
