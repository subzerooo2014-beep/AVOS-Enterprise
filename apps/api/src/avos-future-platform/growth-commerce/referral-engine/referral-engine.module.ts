import { Module } from '@nestjs/common';
import { ReferralEngineController } from './referral-engine.controller';
import { ReferralEngineService } from './referral-engine.service';

@Module({
  controllers: [ReferralEngineController],
  providers: [ReferralEngineService],
  exports: [ReferralEngineService],
})
export class ReferralEngineModule {}