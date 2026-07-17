import { Module } from '@nestjs/common';
import { EnterpriseMetadataLayerController } from './enterprise-metadata-layer.controller';
import { EnterpriseMetadataLayerService } from './enterprise-metadata-layer.service';

@Module({
  controllers: [EnterpriseMetadataLayerController],
  providers: [EnterpriseMetadataLayerService],
  exports: [EnterpriseMetadataLayerService],
})
export class EnterpriseMetadataLayerModule {}