import { Module } from '@nestjs/common';
import { OrganizationalHealthIndexController } from './organizational-health-index.controller';
import { OrganizationalHealthIndexService } from './organizational-health-index.service';

@Module({
  controllers: [OrganizationalHealthIndexController],
  providers: [OrganizationalHealthIndexService],
  exports: [OrganizationalHealthIndexService],
})
export class OrganizationalHealthIndexModule {}