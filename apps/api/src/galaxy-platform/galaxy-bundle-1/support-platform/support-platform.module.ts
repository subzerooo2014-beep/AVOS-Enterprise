import { Module } from "@nestjs/common";
import { SupportPlatformController } from "./support-platform.controller";
import { SupportPlatformService } from "./support-platform.service";

@Module({
  controllers: [SupportPlatformController],
  providers: [SupportPlatformService],
  exports: [SupportPlatformService],
})
export class SupportPlatformModule {}