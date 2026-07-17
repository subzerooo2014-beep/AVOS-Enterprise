import { Module } from '@nestjs/common';
import { RevenueOptimizerController } from './revenue-optimizer.controller';
import { RevenueOptimizerService } from './revenue-optimizer.service';

@Module({
  controllers: [RevenueOptimizerController],
  providers: [RevenueOptimizerService],
  exports: [RevenueOptimizerService],
})
export class RevenueOptimizerModule {}