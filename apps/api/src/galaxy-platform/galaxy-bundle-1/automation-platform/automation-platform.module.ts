import { Module } from "@nestjs/common";
import { AutomationPlatformController } from "./automation-platform.controller";
import { AutomationPlatformService } from "./automation-platform.service";

@Module({
  controllers: [AutomationPlatformController],
  providers: [AutomationPlatformService],
  exports: [AutomationPlatformService],
})
export class AutomationPlatformModule {}