import { Module } from '@nestjs/common';
import { PrescriptiveAnalyticsController } from './prescriptive-analytics.controller';
import { PrescriptiveAnalyticsService } from './prescriptive-analytics.service';

@Module({
  controllers: [PrescriptiveAnalyticsController],
  providers: [PrescriptiveAnalyticsService],
  exports: [PrescriptiveAnalyticsService],
})
export class PrescriptiveAnalyticsModule {}