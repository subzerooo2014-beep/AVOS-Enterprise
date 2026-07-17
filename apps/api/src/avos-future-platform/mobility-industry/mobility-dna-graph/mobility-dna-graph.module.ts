import { Module } from '@nestjs/common';
import { MobilityDnaGraphController } from './mobility-dna-graph.controller';
import { MobilityDnaGraphService } from './mobility-dna-graph.service';

@Module({
  controllers: [MobilityDnaGraphController],
  providers: [MobilityDnaGraphService],
  exports: [MobilityDnaGraphService],
})
export class MobilityDnaGraphModule {}