import { Controller, Get } from '@nestjs/common';
import { AiCeoAssistantService } from './ai-ceo-assistant.service';

@Controller('avos/future/autonomous-enterprise/ai-ceo-assistant')
export class AiCeoAssistantController {
  constructor(private readonly service: AiCeoAssistantService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}