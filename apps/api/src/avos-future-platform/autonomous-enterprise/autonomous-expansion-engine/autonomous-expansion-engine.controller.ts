import { Controller, Get } from '@nestjs/common';
import { AutonomousExpansionEngineService } from './autonomous-expansion-engine.service';

@Controller('avos/future/autonomous-enterprise/autonomous-expansion-engine')
export class AutonomousExpansionEngineController {
  constructor(private readonly service: AutonomousExpansionEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}