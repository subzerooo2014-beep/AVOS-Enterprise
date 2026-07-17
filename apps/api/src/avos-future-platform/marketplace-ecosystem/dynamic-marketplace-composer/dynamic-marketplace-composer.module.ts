import { Module } from '@nestjs/common';
import { DynamicMarketplaceComposerController } from './dynamic-marketplace-composer.controller';
import { DynamicMarketplaceComposerService } from './dynamic-marketplace-composer.service';

@Module({
  controllers: [DynamicMarketplaceComposerController],
  providers: [DynamicMarketplaceComposerService],
  exports: [DynamicMarketplaceComposerService],
})
export class DynamicMarketplaceComposerModule {}