import { Module } from "@nestjs/common";
import { ExportShippingController } from "./export-shipping.controller";
import { ExportShippingService } from "./export-shipping.service";

@Module({
  controllers: [ExportShippingController],
  providers: [ExportShippingService],
  exports: [ExportShippingService],
})
export class ExportShippingModule {}