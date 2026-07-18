import { Module } from "@nestjs/common";
import { EnterpriseProductionController } from "./enterprise-production.controller";
import { EnterpriseProductionService } from "./enterprise-production.service";

@Module({
  controllers: [EnterpriseProductionController],
  providers: [EnterpriseProductionService],
  exports: [EnterpriseProductionService],
})
export class EnterpriseProductionModule {}
