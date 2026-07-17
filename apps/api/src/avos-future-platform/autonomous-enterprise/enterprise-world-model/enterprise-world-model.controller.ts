import { Controller, Get } from '@nestjs/common';
import { EnterpriseWorldModelService } from './enterprise-world-model.service';

@Controller('avos/future/autonomous-enterprise/enterprise-world-model')
export class EnterpriseWorldModelController {
  constructor(private readonly service: EnterpriseWorldModelService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}