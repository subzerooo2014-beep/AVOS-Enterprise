import { Module } from '@nestjs/common';
import { SystemCertifierController } from './system-certifier.controller';
import { SystemCertifierService } from './system-certifier.service';

@Module({
  controllers: [SystemCertifierController],
  providers: [SystemCertifierService],
  exports: [SystemCertifierService],
})
export class SystemCertifierModule {}