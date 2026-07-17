import { Controller, Get } from '@nestjs/common';
import { OperationsCenterService } from './operations-center.service';

@Controller('avos/future/enterprise-products/operations-center')
export class OperationsCenterController {
  constructor(private readonly service: OperationsCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}