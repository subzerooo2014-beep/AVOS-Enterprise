import { Module } from "@nestjs/common";
import { NetworkPlatformController } from "./network-platform.controller";
import { NetworkPlatformService } from "./network-platform.service";

@Module({
  controllers: [NetworkPlatformController],
  providers: [NetworkPlatformService],
  exports: [NetworkPlatformService],
})
export class NetworkPlatformModule {}