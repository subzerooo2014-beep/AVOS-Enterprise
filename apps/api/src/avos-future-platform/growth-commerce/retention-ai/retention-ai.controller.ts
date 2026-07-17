import { Controller, Get } from '@nestjs/common';
import { RetentionAiService } from './retention-ai.service';

@Controller('avos/future/growth-commerce/retention-ai')
export class RetentionAiController {
  constructor(private readonly service: RetentionAiService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}