import { Module } from "@nestjs/common";
import { MediaPlatformController } from "./media-platform.controller";
import { MediaPlatformService } from "./media-platform.service";

@Module({
  controllers: [MediaPlatformController],
  providers: [MediaPlatformService],
  exports: [MediaPlatformService],
})
export class MediaPlatformModule {}