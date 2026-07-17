import { Module } from '@nestjs/common';
import { DelegationAuthorityEngineController } from './delegation-authority-engine.controller';
import { DelegationAuthorityEngineService } from './delegation-authority-engine.service';

@Module({
  controllers: [DelegationAuthorityEngineController],
  providers: [DelegationAuthorityEngineService],
  exports: [DelegationAuthorityEngineService],
})
export class DelegationAuthorityEngineModule {}