import { Module } from "@nestjs/common";
import { EnterpriseEcosystemMarketplaceG9Controller } from "./enterprise-ecosystem-marketplace-g9.controller";
import { EnterpriseEcosystemMarketplaceG9Service } from "./enterprise-ecosystem-marketplace-g9.service";

@Module({
  controllers: [EnterpriseEcosystemMarketplaceG9Controller],
  providers: [EnterpriseEcosystemMarketplaceG9Service],
  exports: [EnterpriseEcosystemMarketplaceG9Service],
})
export class EnterpriseEcosystemMarketplaceG9Module {}