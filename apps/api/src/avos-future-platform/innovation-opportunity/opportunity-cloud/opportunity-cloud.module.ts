import { Module } from '@nestjs/common';
import { OpportunityCloudController } from './opportunity-cloud.controller';
import { OpportunityCloudService } from './opportunity-cloud.service';

@Module({
  controllers: [OpportunityCloudController],
  providers: [OpportunityCloudService],
  exports: [OpportunityCloudService],
})
export class OpportunityCloudModule {}