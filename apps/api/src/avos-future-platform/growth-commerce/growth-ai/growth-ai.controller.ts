import { Controller, Get } from '@nestjs/common';
import { GrowthAiService } from './growth-ai.service';

@Controller('avos/future/growth-commerce/growth-ai')
export class GrowthAiController {
  constructor(private readonly service: GrowthAiService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}