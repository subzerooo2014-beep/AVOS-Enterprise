import { Controller, Get } from '@nestjs/common';
import { ExplainableAiCenterService } from './explainable-ai-center.service';

@Controller('avos/future/trust-governance/explainable-ai-center')
export class ExplainableAiCenterController {
  constructor(private readonly service: ExplainableAiCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}