import { Module } from '@nestjs/common';
import { EnterpriseBrainController } from './enterprise-brain.controller';
import { EnterpriseBrainService } from './enterprise-brain.service';

@Module({
  controllers: [EnterpriseBrainController],
  providers: [EnterpriseBrainService],
  exports: [EnterpriseBrainService],
})
export class EnterpriseBrainModule {}