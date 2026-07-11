import { Module } from "@nestjs/common";
import { SalesPipelineService } from "./sales-pipeline.service";

@Module({
  providers:[SalesPipelineService],
  exports:[SalesPipelineService],
})
export class SalesPipelineModule {}
