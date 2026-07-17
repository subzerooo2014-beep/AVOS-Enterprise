import { Module } from '@nestjs/common';
import { EnterpriseDigitalMemoryController } from './enterprise-digital-memory.controller';
import { EnterpriseDigitalMemoryService } from './enterprise-digital-memory.service';

@Module({
  controllers: [EnterpriseDigitalMemoryController],
  providers: [EnterpriseDigitalMemoryService],
  exports: [EnterpriseDigitalMemoryService],
})
export class EnterpriseDigitalMemoryModule {}