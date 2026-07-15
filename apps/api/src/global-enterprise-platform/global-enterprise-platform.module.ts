import { Module } from "@nestjs/common";
import { GlobalEnterprisePlatformController } from "./global-enterprise-platform.controller";
import { GlobalEnterprisePlatformService } from "./global-enterprise-platform.service";

@Module({
  controllers: [GlobalEnterprisePlatformController],
  providers: [GlobalEnterprisePlatformService],
  exports: [GlobalEnterprisePlatformService],
})
export class GlobalEnterprisePlatformModule {}