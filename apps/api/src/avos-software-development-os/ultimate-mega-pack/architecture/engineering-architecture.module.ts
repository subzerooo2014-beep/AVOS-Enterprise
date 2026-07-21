import { Module } from '@nestjs/common';
import { EngineeringArchitectureService } from './engineering-architecture.service';

@Module({
  providers: [EngineeringArchitectureService],
  exports: [EngineeringArchitectureService],
})
export class EngineeringArchitectureModule {}
