import { Controller, Get } from '@nestjs/common';
import { ArchitectureQualityMonitorService } from './architecture-quality-monitor.service';

@Controller('avos/future/architecture-intelligence/architecture-quality-monitor')
export class ArchitectureQualityMonitorController {
  constructor(private readonly service: ArchitectureQualityMonitorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}