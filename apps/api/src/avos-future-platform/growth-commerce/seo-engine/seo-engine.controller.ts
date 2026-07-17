import { Controller, Get } from '@nestjs/common';
import { SeoEngineService } from './seo-engine.service';

@Controller('avos/future/growth-commerce/seo-engine')
export class SeoEngineController {
  constructor(private readonly service: SeoEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}