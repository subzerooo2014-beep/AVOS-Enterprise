import { Module } from "@nestjs/common";
import { DigitalDnaContractsController } from "./contracts.controller";
import { DigitalDnaContractsService } from "./contracts.service";

@Module({
  controllers: [DigitalDnaContractsController],
  providers: [DigitalDnaContractsService],
  exports: [DigitalDnaContractsService],
})
export class DigitalDnaContractsModule {}