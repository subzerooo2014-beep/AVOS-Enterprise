import { Controller, Get } from '@nestjs/common';
import { CustomerJourneyGenomeService } from './customer-journey-genome.service';

@Controller('avos/future/mobility-industry/customer-journey-genome')
export class CustomerJourneyGenomeController {
  constructor(private readonly service: CustomerJourneyGenomeService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}