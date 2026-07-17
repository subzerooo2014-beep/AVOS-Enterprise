import { Controller, Get } from '@nestjs/common';
import { AiProductArchitectService } from './ai-product-architect.service';

@Controller('avos/future/innovation-opportunity/ai-product-architect')
export class AiProductArchitectController {
  constructor(private readonly service: AiProductArchitectService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}