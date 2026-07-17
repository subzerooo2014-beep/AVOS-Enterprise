import { Controller, Get } from '@nestjs/common';
import { RecoveryPlannerService } from './recovery-planner.service';

@Controller('avos/future/resilience-security/recovery-planner')
export class RecoveryPlannerController {
  constructor(private readonly service: RecoveryPlannerService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}