import { Controller, Get } from '@nestjs/common';
import { RegionalizationEngineService } from './regionalization-engine.service';

@Controller('avos/future/global-platform/regionalization-engine')
export class RegionalizationEngineController {
  constructor(private readonly service: RegionalizationEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}