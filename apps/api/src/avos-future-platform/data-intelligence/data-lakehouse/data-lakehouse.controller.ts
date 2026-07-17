import { Controller, Get } from '@nestjs/common';
import { DataLakehouseService } from './data-lakehouse.service';

@Controller('avos/future/data-intelligence/data-lakehouse')
export class DataLakehouseController {
  constructor(private readonly service: DataLakehouseService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}