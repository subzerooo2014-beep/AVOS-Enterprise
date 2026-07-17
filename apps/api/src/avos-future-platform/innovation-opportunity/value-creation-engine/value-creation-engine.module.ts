import { Module } from '@nestjs/common';
import { ValueCreationEngineController } from './value-creation-engine.controller';
import { ValueCreationEngineService } from './value-creation-engine.service';

@Module({
  controllers: [ValueCreationEngineController],
  providers: [ValueCreationEngineService],
  exports: [ValueCreationEngineService],
})
export class ValueCreationEngineModule {}