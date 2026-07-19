import { Module } from "@nestjs/common";
import { IrOptimizerService } from "./ir-optimizer.service";
import { IrOptimizerController } from "./ir-optimizer.controller";

@Module({
  providers:[IrOptimizerService],
  controllers:[IrOptimizerController],
  exports:[IrOptimizerService]
})
export class IrOptimizerModule {}
