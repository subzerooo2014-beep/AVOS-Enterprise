import { Module } from "@nestjs/common";
import { SimulationPlatformController } from "./simulation-platform.controller";
import { SimulationPlatformService } from "./simulation-platform.service";

@Module({
  controllers: [SimulationPlatformController],
  providers: [SimulationPlatformService],
  exports: [SimulationPlatformService],
})
export class SimulationPlatformModule {}