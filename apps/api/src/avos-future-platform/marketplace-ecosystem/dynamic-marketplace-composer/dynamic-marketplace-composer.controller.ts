import { Controller, Get } from '@nestjs/common';
import { DynamicMarketplaceComposerService } from './dynamic-marketplace-composer.service';

@Controller('avos/future/marketplace-ecosystem/dynamic-marketplace-composer')
export class DynamicMarketplaceComposerController {
  constructor(private readonly service: DynamicMarketplaceComposerService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}