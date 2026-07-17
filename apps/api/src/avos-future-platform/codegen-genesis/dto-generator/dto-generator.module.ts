import { Module } from '@nestjs/common';
import { DtoGeneratorController } from './dto-generator.controller';
import { DtoGeneratorService } from './dto-generator.service';

@Module({
  controllers: [DtoGeneratorController],
  providers: [DtoGeneratorService],
  exports: [DtoGeneratorService],
})
export class DtoGeneratorModule {}