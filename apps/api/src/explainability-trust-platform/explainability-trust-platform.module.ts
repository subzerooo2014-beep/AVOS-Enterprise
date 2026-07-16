import { Module } from "@nestjs/common";
import { ExplainabilityTrustPlatformController } from "./explainability-trust-platform.controller";
import { ExplainabilityTrustPlatformService } from "./explainability-trust-platform.service";

@Module({
  controllers: [ExplainabilityTrustPlatformController],
  providers: [ExplainabilityTrustPlatformService],
  exports: [ExplainabilityTrustPlatformService],
})
export class ExplainabilityTrustPlatformModule {}