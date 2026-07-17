import { Module } from '@nestjs/common';
import { ExecutiveCockpitController } from './executive-cockpit.controller';
import { ExecutiveCockpitService } from './executive-cockpit.service';

@Module({
  controllers: [ExecutiveCockpitController],
  providers: [ExecutiveCockpitService],
  exports: [ExecutiveCockpitService],
})
export class ExecutiveCockpitModule {}