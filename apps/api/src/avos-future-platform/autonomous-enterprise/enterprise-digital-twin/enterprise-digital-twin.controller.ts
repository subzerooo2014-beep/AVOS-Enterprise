import { Controller, Get } from '@nestjs/common';
import { EnterpriseDigitalTwinService } from './enterprise-digital-twin.service';

@Controller('avos/future/autonomous-enterprise/enterprise-digital-twin')
export class EnterpriseDigitalTwinController {
  constructor(private readonly service: EnterpriseDigitalTwinService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}