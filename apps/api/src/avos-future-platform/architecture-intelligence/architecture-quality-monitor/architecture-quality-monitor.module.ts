import { Module } from '@nestjs/common';
import { ArchitectureQualityMonitorController } from './architecture-quality-monitor.controller';
import { ArchitectureQualityMonitorService } from './architecture-quality-monitor.service';

@Module({
  controllers: [ArchitectureQualityMonitorController],
  providers: [ArchitectureQualityMonitorService],
  exports: [ArchitectureQualityMonitorService],
})
export class ArchitectureQualityMonitorModule {}