import { Module } from "@nestjs/common";
import { StreamingPlatformController } from "./streaming-platform.controller";
import { StreamingPlatformService } from "./streaming-platform.service";

@Module({
  controllers: [StreamingPlatformController],
  providers: [StreamingPlatformService],
  exports: [StreamingPlatformService],
})
export class StreamingPlatformModule {}