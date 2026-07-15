import { Module } from "@nestjs/common";
import { InnovationPlatformController } from "./innovation-platform.controller";
import { InnovationPlatformService } from "./innovation-platform.service";

@Module({
  controllers: [InnovationPlatformController],
  providers: [InnovationPlatformService],
  exports: [InnovationPlatformService],
})
export class InnovationPlatformModule {}