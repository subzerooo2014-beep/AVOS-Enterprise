import { Controller, Get } from '@nestjs/common';
import { InnovationPortfolioGovernorService } from './innovation-portfolio-governor.service';

@Controller('avos/future/innovation-opportunity/innovation-portfolio-governor')
export class InnovationPortfolioGovernorController {
  constructor(private readonly service: InnovationPortfolioGovernorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}