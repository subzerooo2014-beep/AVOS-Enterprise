import { Module } from "@nestjs/common";
import { BusinessLaunchController } from "./business-launch.controller";
import { BusinessLaunchService } from "./business-launch.service";

@Module({
  controllers: [BusinessLaunchController],
  providers: [BusinessLaunchService],
  exports: [BusinessLaunchService],
})
export class BusinessLaunchModule {}