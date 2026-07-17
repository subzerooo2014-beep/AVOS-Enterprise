import { Module } from '@nestjs/common';
import { ProjectPlatformController } from './project-platform.controller';
import { ProjectPlatformService } from './project-platform.service';

@Module({
  controllers: [ProjectPlatformController],
  providers: [ProjectPlatformService],
  exports: [ProjectPlatformService],
})
export class ProjectPlatformModule {}