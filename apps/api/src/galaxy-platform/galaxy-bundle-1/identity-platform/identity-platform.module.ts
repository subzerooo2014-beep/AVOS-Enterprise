import { Module } from "@nestjs/common";
import { IdentityPlatformController } from "./identity-platform.controller";
import { IdentityPlatformService } from "./identity-platform.service";

@Module({
  controllers: [IdentityPlatformController],
  providers: [IdentityPlatformService],
  exports: [IdentityPlatformService],
})
export class IdentityPlatformModule {}