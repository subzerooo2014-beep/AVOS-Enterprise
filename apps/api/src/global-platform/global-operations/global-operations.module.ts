import { Module } from "@nestjs/common";
import { GlobalOperationsController } from "./global-operations.controller";
import { GlobalOperationsService } from "./global-operations.service";

@Module({
  controllers: [GlobalOperationsController],
  providers: [GlobalOperationsService],
  exports: [GlobalOperationsService],
})
export class GlobalOperationsModule {}