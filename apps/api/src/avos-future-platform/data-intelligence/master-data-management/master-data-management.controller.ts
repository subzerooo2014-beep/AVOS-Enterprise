import { Controller, Get } from '@nestjs/common';
import { MasterDataManagementService } from './master-data-management.service';

@Controller('avos/future/data-intelligence/master-data-management')
export class MasterDataManagementController {
  constructor(private readonly service: MasterDataManagementService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}