import { Module } from '@nestjs/common';
import { ControllerGeneratorController } from './controller-generator.controller';
import { ControllerGeneratorService } from './controller-generator.service';

@Module({
  controllers: [ControllerGeneratorController],
  providers: [ControllerGeneratorService],
  exports: [ControllerGeneratorService],
})
export class ControllerGeneratorModule {}