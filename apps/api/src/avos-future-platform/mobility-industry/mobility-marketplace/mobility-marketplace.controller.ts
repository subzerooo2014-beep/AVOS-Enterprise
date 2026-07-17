import { Controller, Get } from '@nestjs/common';
import { MobilityMarketplaceService } from './mobility-marketplace.service';

@Controller('avos/future/mobility-industry/mobility-marketplace')
export class MobilityMarketplaceController {
  constructor(private readonly service: MobilityMarketplaceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}