import { Module } from '@nestjs/common';
import { DecisionTraceabilityController } from './decision-traceability.controller';
import { DecisionTraceabilityService } from './decision-traceability.service';

@Module({
  controllers: [DecisionTraceabilityController],
  providers: [DecisionTraceabilityService],
  exports: [DecisionTraceabilityService],
})
export class DecisionTraceabilityModule {}