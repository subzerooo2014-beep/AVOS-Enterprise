import { Module } from '@nestjs/common';
import { DeveloperCloudController } from './developer-cloud.controller';
import { DeveloperCloudService } from './developer-cloud.service';

@Module({
  controllers: [DeveloperCloudController],
  providers: [DeveloperCloudService],
  exports: [DeveloperCloudService],
})
export class DeveloperCloudModule {}