import { Module } from "@nestjs/common";
import { AvosIntegrationController } from "./avos-integration.controller";
import { AvosIntegrationService } from "./avos-integration.service";

@Module({
  controllers: [AvosIntegrationController],
  providers: [AvosIntegrationService],
  exports: [AvosIntegrationService],
})
export class AvosIntegrationModule {}
