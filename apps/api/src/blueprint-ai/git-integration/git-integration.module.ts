import { Module } from "@nestjs/common";
import { GitIntegrationService } from "./git-integration.service";
import { GitIntegrationController } from "./git-integration.controller";

@Module({
  providers:[GitIntegrationService],
  controllers:[GitIntegrationController],
  exports:[GitIntegrationService]
})
export class GitIntegrationModule {}
