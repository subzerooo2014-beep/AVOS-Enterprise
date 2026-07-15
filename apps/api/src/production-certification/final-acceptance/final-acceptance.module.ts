import { Module } from "@nestjs/common";
import { FinalAcceptanceController } from "./final-acceptance.controller";
import { FinalAcceptanceService } from "./final-acceptance.service";

@Module({
  controllers: [FinalAcceptanceController],
  providers: [FinalAcceptanceService],
  exports: [FinalAcceptanceService],
})
export class FinalAcceptanceModule {}