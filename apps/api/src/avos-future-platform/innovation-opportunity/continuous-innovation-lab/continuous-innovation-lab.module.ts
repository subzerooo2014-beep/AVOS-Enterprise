import { Module } from '@nestjs/common';
import { ContinuousInnovationLabController } from './continuous-innovation-lab.controller';
import { ContinuousInnovationLabService } from './continuous-innovation-lab.service';

@Module({
  controllers: [ContinuousInnovationLabController],
  providers: [ContinuousInnovationLabService],
  exports: [ContinuousInnovationLabService],
})
export class ContinuousInnovationLabModule {}