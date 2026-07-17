import { Controller, Get } from '@nestjs/common';
import { BusinessTimeMachineService } from './business-time-machine.service';

@Controller('avos/future/autonomous-enterprise/business-time-machine')
export class BusinessTimeMachineController {
  constructor(private readonly service: BusinessTimeMachineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}