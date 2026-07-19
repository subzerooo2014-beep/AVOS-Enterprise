import { Module } from "@nestjs/common";
import { CompilerMetricsService } from "./compiler-metrics.service";
import { CompilerMetricsController } from "./compiler-metrics.controller";

@Module({
  providers:[CompilerMetricsService],
  controllers:[CompilerMetricsController],
  exports:[CompilerMetricsService]
})
export class CompilerMetricsModule {}
