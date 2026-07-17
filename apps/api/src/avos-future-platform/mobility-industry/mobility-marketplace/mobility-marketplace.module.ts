import { Module } from '@nestjs/common';
import { MobilityMarketplaceController } from './mobility-marketplace.controller';
import { MobilityMarketplaceService } from './mobility-marketplace.service';

@Module({
  controllers: [MobilityMarketplaceController],
  providers: [MobilityMarketplaceService],
  exports: [MobilityMarketplaceService],
})
export class MobilityMarketplaceModule {}