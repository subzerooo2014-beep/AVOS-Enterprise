import { Module } from "@nestjs/common";
import { ModelPlatformController } from "./model-platform.controller";
import { ModelPlatformService } from "./model-platform.service";

@Module({
  controllers: [ModelPlatformController],
  providers: [ModelPlatformService],
  exports: [ModelPlatformService],
})
export class ModelPlatformModule {}