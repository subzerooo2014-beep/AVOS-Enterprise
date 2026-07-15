import { Module } from "@nestjs/common";
import { SecurityPlatformController } from "./security-platform.controller";
import { SecurityPlatformService } from "./security-platform.service";

@Module({
  controllers: [SecurityPlatformController],
  providers: [SecurityPlatformService],
  exports: [SecurityPlatformService],
})
export class SecurityPlatformModule {}