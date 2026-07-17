import { Controller, Get } from '@nestjs/common';
import { RegulationObservatoryService } from './regulation-observatory.service';

@Controller('avos/future/global-platform/regulation-observatory')
export class RegulationObservatoryController {
  constructor(private readonly service: RegulationObservatoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}