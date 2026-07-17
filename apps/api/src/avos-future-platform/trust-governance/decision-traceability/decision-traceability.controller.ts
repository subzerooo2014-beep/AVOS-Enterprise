import { Controller, Get } from '@nestjs/common';
import { DecisionTraceabilityService } from './decision-traceability.service';

@Controller('avos/future/trust-governance/decision-traceability')
export class DecisionTraceabilityController {
  constructor(private readonly service: DecisionTraceabilityService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}