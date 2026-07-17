import { Controller, Get } from '@nestjs/common';
import { ThreatAnticipationEngineService } from './threat-anticipation-engine.service';

@Controller('avos/future/resilience-security/threat-anticipation-engine')
export class ThreatAnticipationEngineController {
  constructor(private readonly service: ThreatAnticipationEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}