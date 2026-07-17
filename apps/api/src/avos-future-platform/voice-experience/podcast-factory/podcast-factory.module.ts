import { Module } from '@nestjs/common';
import { PodcastFactoryController } from './podcast-factory.controller';
import { PodcastFactoryService } from './podcast-factory.service';

@Module({
  controllers: [PodcastFactoryController],
  providers: [PodcastFactoryService],
  exports: [PodcastFactoryService],
})
export class PodcastFactoryModule {}