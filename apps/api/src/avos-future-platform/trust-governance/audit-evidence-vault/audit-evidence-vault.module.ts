import { Module } from '@nestjs/common';
import { AuditEvidenceVaultController } from './audit-evidence-vault.controller';
import { AuditEvidenceVaultService } from './audit-evidence-vault.service';

@Module({
  controllers: [AuditEvidenceVaultController],
  providers: [AuditEvidenceVaultService],
  exports: [AuditEvidenceVaultService],
})
export class AuditEvidenceVaultModule {}