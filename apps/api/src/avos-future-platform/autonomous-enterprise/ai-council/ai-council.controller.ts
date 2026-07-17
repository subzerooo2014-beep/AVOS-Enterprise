import { Controller, Get } from '@nestjs/common';
import { AiCouncilService } from './ai-council.service';

@Controller('avos/future/autonomous-enterprise/ai-council')
export class AiCouncilController {
  constructor(private readonly service: AiCouncilService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}