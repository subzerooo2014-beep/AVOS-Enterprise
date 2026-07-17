import { Module } from "@nestjs/common";
import { ArchitectureObservatoryController } from "./observatory.controller";
import { ArchitectureObservatoryService } from "./observatory.service";

@Module({
  controllers: [ArchitectureObservatoryController],
  providers: [ArchitectureObservatoryService],
  exports: [ArchitectureObservatoryService],
})
export class ArchitectureObservatoryModule {}