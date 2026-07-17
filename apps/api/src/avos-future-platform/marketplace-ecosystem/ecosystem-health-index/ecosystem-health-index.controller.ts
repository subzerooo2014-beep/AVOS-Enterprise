import { Controller, Get } from '@nestjs/common';
import { EcosystemHealthIndexService } from './ecosystem-health-index.service';

@Controller('avos/future/marketplace-ecosystem/ecosystem-health-index')
export class EcosystemHealthIndexController {
  constructor(private readonly service: EcosystemHealthIndexService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}