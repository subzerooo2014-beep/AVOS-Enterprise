import { Controller, Get } from '@nestjs/common';
import { CapabilityMarketplaceService } from './capability-marketplace.service';

@Controller('avos/future/marketplace-ecosystem/capability-marketplace')
export class CapabilityMarketplaceController {
  constructor(private readonly service: CapabilityMarketplaceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}