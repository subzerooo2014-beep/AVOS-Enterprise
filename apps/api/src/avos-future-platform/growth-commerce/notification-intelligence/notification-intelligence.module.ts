import { Module } from '@nestjs/common';
import { NotificationIntelligenceController } from './notification-intelligence.controller';
import { NotificationIntelligenceService } from './notification-intelligence.service';

@Module({
  controllers: [NotificationIntelligenceController],
  providers: [NotificationIntelligenceService],
  exports: [NotificationIntelligenceService],
})
export class NotificationIntelligenceModule {}