import { Controller, Get } from '@nestjs/common';
import { LogisticsPlatformService } from './logistics-platform.service';

@Controller('avos/future/mobility-industry/logistics-platform')
export class LogisticsPlatformController {
  constructor(private readonly service: LogisticsPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}