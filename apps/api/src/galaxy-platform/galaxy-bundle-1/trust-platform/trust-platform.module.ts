import { Module } from "@nestjs/common";
import { TrustPlatformController } from "./trust-platform.controller";
import { TrustPlatformService } from "./trust-platform.service";

@Module({
  controllers: [TrustPlatformController],
  providers: [TrustPlatformService],
  exports: [TrustPlatformService],
})
export class TrustPlatformModule {}