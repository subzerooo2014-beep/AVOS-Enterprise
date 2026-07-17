import { Controller, Get } from '@nestjs/common';
import { SubscriptionBillingService } from './subscription-billing.service';

@Controller('avos/future/global-platform/subscription-billing')
export class SubscriptionBillingController {
  constructor(private readonly service: SubscriptionBillingService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}