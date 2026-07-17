import { Controller, Get } from '@nestjs/common';
import { EnterpriseBrainService } from './enterprise-brain.service';

@Controller('avos/future/autonomous-enterprise/enterprise-brain')
export class EnterpriseBrainController {
  constructor(private readonly service: EnterpriseBrainService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}