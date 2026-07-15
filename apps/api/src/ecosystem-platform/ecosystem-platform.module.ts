import { Module } from "@nestjs/common";
import { EcosystemPlatformController } from "./ecosystem-platform.controller";
import { EcosystemPlatformService } from "./ecosystem-platform.service";

@Module({
  controllers: [EcosystemPlatformController],
  providers: [EcosystemPlatformService],
  exports: [EcosystemPlatformService],
})
export class EcosystemPlatformModule {}