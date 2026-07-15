import { Module } from "@nestjs/common";
import { EnterpriseEcosystemController } from "./enterprise-ecosystem.controller";
import { EnterpriseEcosystemService } from "./enterprise-ecosystem.service";

@Module({
  controllers: [EnterpriseEcosystemController],
  providers: [EnterpriseEcosystemService],
  exports: [EnterpriseEcosystemService],
})
export class EnterpriseEcosystemModule {}