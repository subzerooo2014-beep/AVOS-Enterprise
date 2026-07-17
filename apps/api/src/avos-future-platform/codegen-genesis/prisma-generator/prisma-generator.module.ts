import { Module } from '@nestjs/common';
import { PrismaGeneratorController } from './prisma-generator.controller';
import { PrismaGeneratorService } from './prisma-generator.service';

@Module({
  controllers: [PrismaGeneratorController],
  providers: [PrismaGeneratorService],
  exports: [PrismaGeneratorService],
})
export class PrismaGeneratorModule {}