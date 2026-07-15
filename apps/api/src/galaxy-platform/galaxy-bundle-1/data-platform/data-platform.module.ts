import { Module } from "@nestjs/common";
import { DataPlatformController } from "./data-platform.controller";
import { DataPlatformService } from "./data-platform.service";

@Module({
  controllers: [DataPlatformController],
  providers: [DataPlatformService],
  exports: [DataPlatformService],
})
export class DataPlatformModule {}