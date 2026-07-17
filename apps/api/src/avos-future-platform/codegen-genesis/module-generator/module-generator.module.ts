import { Module } from '@nestjs/common';
import { ModuleGeneratorController } from './module-generator.controller';
import { ModuleGeneratorService } from './module-generator.service';

@Module({
  controllers: [ModuleGeneratorController],
  providers: [ModuleGeneratorService],
  exports: [ModuleGeneratorService],
})
export class ModuleGeneratorModule {}