import { Module } from '@nestjs/common';
import { SelfDiagnosisEngineController } from './self-diagnosis-engine.controller';
import { SelfDiagnosisEngineService } from './self-diagnosis-engine.service';

@Module({
  controllers: [SelfDiagnosisEngineController],
  providers: [SelfDiagnosisEngineService],
  exports: [SelfDiagnosisEngineService],
})
export class SelfDiagnosisEngineModule {}