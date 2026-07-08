import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PlatformEnterpriseController } from './platform-enterprise.controller';
import { PlatformEnterpriseService } from './platform-enterprise.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlatformEnterpriseController],
  providers: [PlatformEnterpriseService],
  exports: [PlatformEnterpriseService],
})
export class PlatformEnterpriseModule {}
