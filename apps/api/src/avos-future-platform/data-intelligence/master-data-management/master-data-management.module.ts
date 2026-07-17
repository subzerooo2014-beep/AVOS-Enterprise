import { Module } from '@nestjs/common';
import { MasterDataManagementController } from './master-data-management.controller';
import { MasterDataManagementService } from './master-data-management.service';

@Module({
  controllers: [MasterDataManagementController],
  providers: [MasterDataManagementService],
  exports: [MasterDataManagementService],
})
export class MasterDataManagementModule {}