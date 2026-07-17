import { Controller, Get } from '@nestjs/common';
import { PredictiveMarketplaceService } from './predictive-marketplace.service';

@Controller('avos/future/marketplace-ecosystem/predictive-marketplace')
export class PredictiveMarketplaceController {
  constructor(private readonly service: PredictiveMarketplaceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}