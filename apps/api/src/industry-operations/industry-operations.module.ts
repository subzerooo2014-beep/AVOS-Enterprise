import { Module } from "@nestjs/common";
import { IndustryOperationsController } from "./industry-operations.controller";
import { IndustryOperationsService } from "./industry-operations.service";

@Module({
  controllers: [IndustryOperationsController],
  providers: [IndustryOperationsService],
  exports: [IndustryOperationsService],
})
export class IndustryOperationsModule {}