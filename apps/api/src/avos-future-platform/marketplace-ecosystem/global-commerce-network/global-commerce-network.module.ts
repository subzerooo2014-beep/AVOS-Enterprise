import { Module } from '@nestjs/common';
import { GlobalCommerceNetworkController } from './global-commerce-network.controller';
import { GlobalCommerceNetworkService } from './global-commerce-network.service';

@Module({
  controllers: [GlobalCommerceNetworkController],
  providers: [GlobalCommerceNetworkService],
  exports: [GlobalCommerceNetworkService],
})
export class GlobalCommerceNetworkModule {}