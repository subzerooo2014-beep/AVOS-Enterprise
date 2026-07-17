import { Module } from '@nestjs/common';
import { SubscriptionBillingController } from './subscription-billing.controller';
import { SubscriptionBillingService } from './subscription-billing.service';

@Module({
  controllers: [SubscriptionBillingController],
  providers: [SubscriptionBillingService],
  exports: [SubscriptionBillingService],
})
export class SubscriptionBillingModule {}