import { Controller, Get } from '@nestjs/common';
import { IdeaEvolutionEngineService } from './idea-evolution-engine.service';

@Controller('avos/future/innovation-opportunity/idea-evolution-engine')
export class IdeaEvolutionEngineController {
  constructor(private readonly service: IdeaEvolutionEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}