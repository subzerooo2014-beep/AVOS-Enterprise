import { Controller, Get } from '@nestjs/common';
import { BlueprintMarketplaceService } from './blueprint-marketplace.service';

@Controller('avos/future/marketplace-ecosystem/blueprint-marketplace')
export class BlueprintMarketplaceController {
  constructor(private readonly service: BlueprintMarketplaceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}