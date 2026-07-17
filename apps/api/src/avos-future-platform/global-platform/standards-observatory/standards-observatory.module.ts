import { Module } from '@nestjs/common';
import { StandardsObservatoryController } from './standards-observatory.controller';
import { StandardsObservatoryService } from './standards-observatory.service';

@Module({
  controllers: [StandardsObservatoryController],
  providers: [StandardsObservatoryService],
  exports: [StandardsObservatoryService],
})
export class StandardsObservatoryModule {}