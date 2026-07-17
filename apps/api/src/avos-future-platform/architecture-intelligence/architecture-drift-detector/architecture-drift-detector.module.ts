import { Module } from '@nestjs/common';
import { ArchitectureDriftDetectorController } from './architecture-drift-detector.controller';
import { ArchitectureDriftDetectorService } from './architecture-drift-detector.service';

@Module({
  controllers: [ArchitectureDriftDetectorController],
  providers: [ArchitectureDriftDetectorService],
  exports: [ArchitectureDriftDetectorService],
})
export class ArchitectureDriftDetectorModule {}