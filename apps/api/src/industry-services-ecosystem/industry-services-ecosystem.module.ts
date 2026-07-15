import { Module } from "@nestjs/common";
import { IndustryServicesEcosystemController } from "./industry-services-ecosystem.controller";
import { IndustryServicesEcosystemService } from "./industry-services-ecosystem.service";

@Module({
  controllers: [IndustryServicesEcosystemController],
  providers: [IndustryServicesEcosystemService],
  exports: [IndustryServicesEcosystemService],
})
export class IndustryServicesEcosystemModule {}