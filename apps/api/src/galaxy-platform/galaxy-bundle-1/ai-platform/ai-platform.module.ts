import { Module } from "@nestjs/common";
import { AiPlatformController } from "./ai-platform.controller";
import { AiPlatformService } from "./ai-platform.service";

@Module({
  controllers: [AiPlatformController],
  providers: [AiPlatformService],
  exports: [AiPlatformService],
})
export class AiPlatformModule {}