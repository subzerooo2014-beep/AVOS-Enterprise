import { Controller, Get } from '@nestjs/common';
import { OpportunityCloudService } from './opportunity-cloud.service';

@Controller('avos/future/innovation-opportunity/opportunity-cloud')
export class OpportunityCloudController {
  constructor(private readonly service: OpportunityCloudService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}