import { Controller, Get } from '@nestjs/common';
import { ContinuityManagementService } from './continuity-management.service';

@Controller('avos/future/resilience-security/continuity-management')
export class ContinuityManagementController {
  constructor(private readonly service: ContinuityManagementService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}