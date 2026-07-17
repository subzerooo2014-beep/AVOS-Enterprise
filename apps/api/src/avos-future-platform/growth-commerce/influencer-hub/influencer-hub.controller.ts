import { Controller, Get } from '@nestjs/common';
import { InfluencerHubService } from './influencer-hub.service';

@Controller('avos/future/growth-commerce/influencer-hub')
export class InfluencerHubController {
  constructor(private readonly service: InfluencerHubService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}