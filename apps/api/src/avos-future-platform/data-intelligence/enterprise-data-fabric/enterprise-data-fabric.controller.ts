import { Controller, Get } from '@nestjs/common';
import { EnterpriseDataFabricService } from './enterprise-data-fabric.service';

@Controller('avos/future/data-intelligence/enterprise-data-fabric')
export class EnterpriseDataFabricController {
  constructor(private readonly service: EnterpriseDataFabricService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}