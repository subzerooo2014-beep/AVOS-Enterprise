import { Controller, Get } from '@nestjs/common';
import { ArchitectureDriftDetectorService } from './architecture-drift-detector.service';

@Controller('avos/future/architecture-intelligence/architecture-drift-detector')
export class ArchitectureDriftDetectorController {
  constructor(private readonly service: ArchitectureDriftDetectorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}