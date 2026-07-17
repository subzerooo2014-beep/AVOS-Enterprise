import { Controller, Get } from '@nestjs/common';
import { TrustScoreEngineService } from './trust-score-engine.service';

@Controller('avos/future/trust-governance/trust-score-engine')
export class TrustScoreEngineController {
  constructor(private readonly service: TrustScoreEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}