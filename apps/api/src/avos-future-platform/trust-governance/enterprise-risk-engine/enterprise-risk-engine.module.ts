import { Module } from '@nestjs/common';
import { EnterpriseRiskEngineController } from './enterprise-risk-engine.controller';
import { EnterpriseRiskEngineService } from './enterprise-risk-engine.service';

@Module({
  controllers: [EnterpriseRiskEngineController],
  providers: [EnterpriseRiskEngineService],
  exports: [EnterpriseRiskEngineService],
})
export class EnterpriseRiskEngineModule {}