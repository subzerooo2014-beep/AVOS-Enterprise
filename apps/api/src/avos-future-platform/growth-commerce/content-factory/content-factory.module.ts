import { Module } from '@nestjs/common';
import { ContentFactoryController } from './content-factory.controller';
import { ContentFactoryService } from './content-factory.service';

@Module({
  controllers: [ContentFactoryController],
  providers: [ContentFactoryService],
  exports: [ContentFactoryService],
})
export class ContentFactoryModule {}