import { Module } from '@nestjs/common';
import { PredictiveMarketplaceController } from './predictive-marketplace.controller';
import { PredictiveMarketplaceService } from './predictive-marketplace.service';

@Module({
  controllers: [PredictiveMarketplaceController],
  providers: [PredictiveMarketplaceService],
  exports: [PredictiveMarketplaceService],
})
export class PredictiveMarketplaceModule {}