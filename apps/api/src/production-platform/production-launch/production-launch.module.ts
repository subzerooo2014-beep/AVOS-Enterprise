import { Module } from "@nestjs/common";
import { ProductionLaunchController } from "./production-launch.controller";
import { ProductionLaunchService } from "./production-launch.service";

@Module({
  controllers: [ProductionLaunchController],
  providers: [ProductionLaunchService],
  exports: [ProductionLaunchService],
})
export class ProductionLaunchModule {}