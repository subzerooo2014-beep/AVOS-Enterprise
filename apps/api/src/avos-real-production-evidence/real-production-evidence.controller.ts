import { Body, Controller, Get, Post } from '@nestjs/common';
import { RealProductionEvidenceService } from './real-production-evidence.service';
import { RealProductionEvidenceManifest } from './real-production-evidence.types';

@Controller('avos/production/real-evidence')
export class RealProductionEvidenceController {
  constructor(
    private readonly evidenceService: RealProductionEvidenceService,
  ) {}

  @Get('status')
  status() {
    return this.evidenceService.status();
  }

  @Post('manifest/import')
  importManifest(
    @Body() manifest: RealProductionEvidenceManifest,
  ) {
    return this.evidenceService.importManifest(manifest);
  }

  @Post('certify')
  certify(
    @Body() body: { approvedBy: string },
  ) {
    return this.evidenceService.certify(body.approvedBy);
  }
}
