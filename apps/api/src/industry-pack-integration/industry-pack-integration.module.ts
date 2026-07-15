import { Module } from "@nestjs/common";
import { UniversalIndustryCoreModule } from "../universal-industry-core/universal-industry-core.module";
import { IndustryPackIntegrationController } from "./industry-pack-integration.controller";
import { IndustryPackIntegrationService } from "./industry-pack-integration.service";

@Module({
  imports: [UniversalIndustryCoreModule],
  controllers: [IndustryPackIntegrationController],
  providers: [IndustryPackIntegrationService],
  exports: [IndustryPackIntegrationService],
})
export class IndustryPackIntegrationModule {}