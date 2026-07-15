import { Module } from "@nestjs/common";
import { LegalPlatformController } from "./legal-platform.controller";
import { LegalPlatformService } from "./legal-platform.service";

@Module({
  controllers: [LegalPlatformController],
  providers: [LegalPlatformService],
  exports: [LegalPlatformService],
})
export class LegalPlatformModule {}