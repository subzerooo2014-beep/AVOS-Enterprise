import { Controller, Get } from '@nestjs/common';
import { SelfHealingEngineService } from './self-healing-engine.service';

@Controller('avos/future/resilience-security/self-healing-engine')
export class SelfHealingEngineController {
  constructor(private readonly service: SelfHealingEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}