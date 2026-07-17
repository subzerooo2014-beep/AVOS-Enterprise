import { Controller, Get } from '@nestjs/common';
import { GrowthBrainService } from './growth-brain.service';

@Controller('avos/future/growth-commerce/growth-brain')
export class GrowthBrainController {
  constructor(private readonly service: GrowthBrainService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}