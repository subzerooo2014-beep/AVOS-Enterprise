import { Module } from '@nestjs/common';
import { RollbackIntelligenceController } from './rollback-intelligence.controller';
import { RollbackIntelligenceService } from './rollback-intelligence.service';

@Module({
  controllers: [RollbackIntelligenceController],
  providers: [RollbackIntelligenceService],
  exports: [RollbackIntelligenceService],
})
export class RollbackIntelligenceModule {}