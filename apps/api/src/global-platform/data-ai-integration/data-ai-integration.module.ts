import { Module } from "@nestjs/common";
import { DataAiIntegrationController } from "./data-ai-integration.controller";
import { DataAiIntegrationService } from "./data-ai-integration.service";

@Module({
  controllers: [DataAiIntegrationController],
  providers: [DataAiIntegrationService],
  exports: [DataAiIntegrationService],
})
export class DataAiIntegrationModule {}