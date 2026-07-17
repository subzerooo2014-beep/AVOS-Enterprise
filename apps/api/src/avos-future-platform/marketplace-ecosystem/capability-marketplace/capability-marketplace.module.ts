import { Module } from '@nestjs/common';
import { CapabilityMarketplaceController } from './capability-marketplace.controller';
import { CapabilityMarketplaceService } from './capability-marketplace.service';

@Module({
  controllers: [CapabilityMarketplaceController],
  providers: [CapabilityMarketplaceService],
  exports: [CapabilityMarketplaceService],
})
export class CapabilityMarketplaceModule {}