import { Module } from '@nestjs/common';
import { InteractiveStorytellingController } from './interactive-storytelling.controller';
import { InteractiveStorytellingService } from './interactive-storytelling.service';

@Module({
  controllers: [InteractiveStorytellingController],
  providers: [InteractiveStorytellingService],
  exports: [InteractiveStorytellingService],
})
export class InteractiveStorytellingModule {}