import { Module } from '@nestjs/common';
import { ArchitecturePolicyValidatorController } from './architecture-policy-validator.controller';
import { ArchitecturePolicyValidatorService } from './architecture-policy-validator.service';

@Module({
  controllers: [ArchitecturePolicyValidatorController],
  providers: [ArchitecturePolicyValidatorService],
  exports: [ArchitecturePolicyValidatorService],
})
export class ArchitecturePolicyValidatorModule {}