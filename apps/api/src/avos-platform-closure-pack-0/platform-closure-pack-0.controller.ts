import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlatformClosurePack0Service } from './platform-closure-pack-0.service';

@Controller('avos/platform-closure/pack-0')
export class PlatformClosurePack0Controller {
  constructor(private readonly service: PlatformClosurePack0Service) {}

  @Get('status')
  status() {
    return this.service.status();
  }

  @Post('full-scan')
  fullScan(@Body() body?: { root?: string }) {
    return this.service.fullScan(body?.root);
  }

  @Get('inventory')
  inventory() {
    return this.service.inventory();
  }

  @Get('capabilities')
  capabilities() {
    return this.service.capabilities();
  }

  @Get('dependencies')
  dependencies() {
    return this.service.dependencies();
  }

  @Get('duplicates')
  duplicates() {
    return this.service.duplicates();
  }

  @Get('health')
  health() {
    return this.service.health();
  }

  @Get('consolidation')
  consolidation() {
    return this.service.consolidation();
  }

  @Get('gaps')
  gaps() {
    return this.service.gaps();
  }
}