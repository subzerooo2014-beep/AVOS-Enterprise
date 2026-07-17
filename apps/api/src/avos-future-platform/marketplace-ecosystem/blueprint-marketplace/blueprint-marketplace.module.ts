import { Module } from '@nestjs/common';
import { BlueprintMarketplaceController } from './blueprint-marketplace.controller';
import { BlueprintMarketplaceService } from './blueprint-marketplace.service';

@Module({
  controllers: [BlueprintMarketplaceController],
  providers: [BlueprintMarketplaceService],
  exports: [BlueprintMarketplaceService],
})
export class BlueprintMarketplaceModule {}