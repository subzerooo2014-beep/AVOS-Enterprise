import { Controller, Get } from '@nestjs/common';
import { ViralEngineService } from './viral-engine.service';

@Controller('avos/future/growth-commerce/viral-engine')
export class ViralEngineController {
  constructor(private readonly service: ViralEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}