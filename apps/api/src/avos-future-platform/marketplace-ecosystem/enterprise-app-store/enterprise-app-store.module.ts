import { Module } from '@nestjs/common';
import { EnterpriseAppStoreController } from './enterprise-app-store.controller';
import { EnterpriseAppStoreService } from './enterprise-app-store.service';

@Module({
  controllers: [EnterpriseAppStoreController],
  providers: [EnterpriseAppStoreService],
  exports: [EnterpriseAppStoreService],
})
export class EnterpriseAppStoreModule {}