import { Controller, Get } from '@nestjs/common';
import { MobilityDnaGraphService } from './mobility-dna-graph.service';

@Controller('avos/future/mobility-industry/mobility-dna-graph')
export class MobilityDnaGraphController {
  constructor(private readonly service: MobilityDnaGraphService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}