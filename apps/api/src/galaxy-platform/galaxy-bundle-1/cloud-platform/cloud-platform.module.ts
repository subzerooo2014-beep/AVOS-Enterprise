import { Module } from "@nestjs/common";
import { CloudPlatformController } from "./cloud-platform.controller";
import { CloudPlatformService } from "./cloud-platform.service";

@Module({
  controllers: [CloudPlatformController],
  providers: [CloudPlatformService],
  exports: [CloudPlatformService],
})
export class CloudPlatformModule {}