import { Module } from '@nestjs/common';
import { InfluencerHubController } from './influencer-hub.controller';
import { InfluencerHubService } from './influencer-hub.service';

@Module({
  controllers: [InfluencerHubController],
  providers: [InfluencerHubService],
  exports: [InfluencerHubService],
})
export class InfluencerHubModule {}