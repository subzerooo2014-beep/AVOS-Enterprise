import { Module } from "@nestjs/common";
import { ContentPlatformController } from "./content-platform.controller";
import { ContentPlatformService } from "./content-platform.service";

@Module({
  controllers: [ContentPlatformController],
  providers: [ContentPlatformService],
  exports: [ContentPlatformService],
})
export class ContentPlatformModule {}