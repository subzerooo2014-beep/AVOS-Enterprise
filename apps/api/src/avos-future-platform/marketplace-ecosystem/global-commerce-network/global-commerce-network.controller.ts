import { Controller, Get } from '@nestjs/common';
import { GlobalCommerceNetworkService } from './global-commerce-network.service';

@Controller('avos/future/marketplace-ecosystem/global-commerce-network')
export class GlobalCommerceNetworkController {
  constructor(private readonly service: GlobalCommerceNetworkService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}