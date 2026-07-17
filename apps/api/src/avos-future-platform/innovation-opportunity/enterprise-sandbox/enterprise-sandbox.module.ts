import { Module } from '@nestjs/common';
import { EnterpriseSandboxController } from './enterprise-sandbox.controller';
import { EnterpriseSandboxService } from './enterprise-sandbox.service';

@Module({
  controllers: [EnterpriseSandboxController],
  providers: [EnterpriseSandboxService],
  exports: [EnterpriseSandboxService],
})
export class EnterpriseSandboxModule {}