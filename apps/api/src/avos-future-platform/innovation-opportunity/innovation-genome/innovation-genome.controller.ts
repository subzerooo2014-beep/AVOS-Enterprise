import { Controller, Get } from '@nestjs/common';
import { InnovationGenomeService } from './innovation-genome.service';

@Controller('avos/future/innovation-opportunity/innovation-genome')
export class InnovationGenomeController {
  constructor(private readonly service: InnovationGenomeService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}