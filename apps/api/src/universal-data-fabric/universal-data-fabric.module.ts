import { Module } from "@nestjs/common";
import { UniversalDataFabricController } from "./universal-data-fabric.controller";
import { UniversalDataFabricService } from "./universal-data-fabric.service";

@Module({
  controllers: [UniversalDataFabricController],
  providers: [UniversalDataFabricService],
  exports: [UniversalDataFabricService],
})
export class UniversalDataFabricModule {}