import { Controller, Get } from '@nestjs/common';
import { SecurityIntelligenceCenterService } from './security-intelligence-center.service';

@Controller('avos/future/resilience-security/security-intelligence-center')
export class SecurityIntelligenceCenterController {
  constructor(private readonly service: SecurityIntelligenceCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}