import { Controller, Get } from '@nestjs/common';
import { AuditEvidenceVaultService } from './audit-evidence-vault.service';

@Controller('avos/future/trust-governance/audit-evidence-vault')
export class AuditEvidenceVaultController {
  constructor(private readonly service: AuditEvidenceVaultService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}