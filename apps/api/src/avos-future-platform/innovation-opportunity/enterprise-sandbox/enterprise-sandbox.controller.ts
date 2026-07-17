import { Controller, Get } from '@nestjs/common';
import { EnterpriseSandboxService } from './enterprise-sandbox.service';

@Controller('avos/future/innovation-opportunity/enterprise-sandbox')
export class EnterpriseSandboxController {
  constructor(private readonly service: EnterpriseSandboxService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}