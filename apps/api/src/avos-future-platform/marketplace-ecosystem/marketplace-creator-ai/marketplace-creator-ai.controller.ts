import { Controller, Get } from '@nestjs/common';
import { MarketplaceCreatorAiService } from './marketplace-creator-ai.service';

@Controller('avos/future/marketplace-ecosystem/marketplace-creator-ai')
export class MarketplaceCreatorAiController {
  constructor(private readonly service: MarketplaceCreatorAiService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}