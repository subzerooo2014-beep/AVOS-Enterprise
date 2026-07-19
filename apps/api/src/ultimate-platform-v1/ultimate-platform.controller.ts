import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UltimatePlatformRegistry } from './ultimate-platform.registry';
import { UltimatePlatformService } from './ultimate-platform.service';
import { AvosPlatformDomainId } from './ultimate-platform.types';

@Controller('avos/v1')
export class UltimatePlatformController {
  constructor(
    private readonly service: UltimatePlatformService,
    private readonly registry: UltimatePlatformRegistry,
  ) {}

  @Post('boot')
  boot() {
    return this.service.boot();
  }

  @Get('status')
  status() {
    return this.service.status();
  }

  @Get('architecture')
  architecture() {
    return this.service.architecture();
  }

  @Get('metrics')
  metrics() {
    return this.service.metrics();
  }

  @Get('domains')
  domains() {
    return this.registry.list();
  }

  @Get('domains/:id')
  domain(@Param('id') id: AvosPlatformDomainId) {
    return (
      this.registry.get(id) ?? {
        statusCode: 404,
        message: `AVOS V1 domain '${id}' was not found.`,
      }
    );
  }

  @Get('events')
  events() {
    return this.service.listEvents();
  }

  @Post('verification/run')
  verification() {
    return this.service.runVerification();
  }

  @Post('smoke/run')
  smoke() {
    return this.service.runSmoke();
  }

  @Post('certification/certify')
  certify(@Body() body: { approvedBy?: string }) {
    return this.service.certify(body?.approvedBy ?? '');
  }

  @Get('certification/status')
  certificationStatus() {
    return this.service.status().latestCertification;
  }
}