import { Controller, Get } from '@nestjs/common';
import { DataLineageService } from './data-lineage.service';

@Controller('avos/future/data-intelligence/data-lineage')
export class DataLineageController {
  constructor(private readonly service: DataLineageService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}