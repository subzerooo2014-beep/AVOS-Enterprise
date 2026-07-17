import { Module } from '@nestjs/common';
import { InnovationGenomeController } from './innovation-genome.controller';
import { InnovationGenomeService } from './innovation-genome.service';

@Module({
  controllers: [InnovationGenomeController],
  providers: [InnovationGenomeService],
  exports: [InnovationGenomeService],
})
export class InnovationGenomeModule {}