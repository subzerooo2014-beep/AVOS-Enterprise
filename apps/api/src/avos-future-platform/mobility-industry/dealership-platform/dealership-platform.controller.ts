import { Controller, Get } from '@nestjs/common';
import { DealershipPlatformService } from './dealership-platform.service';

@Controller('avos/future/mobility-industry/dealership-platform')
export class DealershipPlatformController {
  constructor(private readonly service: DealershipPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}