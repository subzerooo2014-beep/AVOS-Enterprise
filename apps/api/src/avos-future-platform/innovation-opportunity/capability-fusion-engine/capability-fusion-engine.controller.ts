import { Controller, Get } from '@nestjs/common';
import { CapabilityFusionEngineService } from './capability-fusion-engine.service';

@Controller('avos/future/innovation-opportunity/capability-fusion-engine')
export class CapabilityFusionEngineController {
  constructor(private readonly service: CapabilityFusionEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}