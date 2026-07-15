import { Module } from "@nestjs/common";
import { RevenuePlatformController } from "./revenue-platform.controller";
import { RevenuePlatformService } from "./revenue-platform.service";

@Module({
  controllers: [RevenuePlatformController],
  providers: [RevenuePlatformService],
  exports: [RevenuePlatformService],
})
export class RevenuePlatformModule {}