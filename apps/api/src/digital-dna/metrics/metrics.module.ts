import { Module } from "@nestjs/common";
import { DigitalDnaMetricsController } from "./metrics.controller";
import { DigitalDnaMetricsService } from "./metrics.service";

@Module({
  controllers: [DigitalDnaMetricsController],
  providers: [DigitalDnaMetricsService],
  exports: [DigitalDnaMetricsService],
})
export class DigitalDnaMetricsModule {}