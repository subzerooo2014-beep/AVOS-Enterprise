import { Module } from "@nestjs/common";
import { IndustryPlatformController } from "./industry-platform.controller";
import { IndustryPlatformService } from "./industry-platform.service";

@Module({
  controllers: [IndustryPlatformController],
  providers: [IndustryPlatformService],
  exports: [IndustryPlatformService],
})
export class IndustryPlatformModule {}