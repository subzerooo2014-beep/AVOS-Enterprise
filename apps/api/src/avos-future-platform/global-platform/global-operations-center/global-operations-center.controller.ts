import { Controller, Get } from '@nestjs/common';
import { GlobalOperationsCenterService } from './global-operations-center.service';

@Controller('avos/future/global-platform/global-operations-center')
export class GlobalOperationsCenterController {
  constructor(private readonly service: GlobalOperationsCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}