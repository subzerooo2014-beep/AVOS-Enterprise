import { Controller, Get } from '@nestjs/common';
import { OrganizationalHealthIndexService } from './organizational-health-index.service';

@Controller('avos/future/resilience-security/organizational-health-index')
export class OrganizationalHealthIndexController {
  constructor(private readonly service: OrganizationalHealthIndexService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}