import { Controller, Get } from '@nestjs/common';
import { StandardsObservatoryService } from './standards-observatory.service';

@Controller('avos/future/global-platform/standards-observatory')
export class StandardsObservatoryController {
  constructor(private readonly service: StandardsObservatoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}