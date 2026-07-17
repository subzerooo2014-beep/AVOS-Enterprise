import { Controller, Get } from '@nestjs/common';
import { DataGovernanceCenterService } from './data-governance-center.service';

@Controller('avos/future/data-intelligence/data-governance-center')
export class DataGovernanceCenterController {
  constructor(private readonly service: DataGovernanceCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}