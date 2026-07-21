import { Module } from '@nestjs/common';
import { HypervisorDistributedRuntimeController } from './hypervisor-distributed-runtime.controller';
import { HypervisorDistributedRuntimeService } from './hypervisor-distributed-runtime.service';
import { HypervisorRuntimeRepository } from './hypervisor-runtime.repository';

@Module({
  controllers: [HypervisorDistributedRuntimeController],
  providers: [
    HypervisorDistributedRuntimeService,
    HypervisorRuntimeRepository,
  ],
  exports: [HypervisorDistributedRuntimeService],
})
export class HypervisorDistributedRuntimeModule {}