import { BadRequestException, Injectable } from '@nestjs/common';
import { mkdirSync,writeFileSync } from 'node:fs'; import { join,resolve } from 'node:path';
import { CertificationDto } from './dto'; import { VerificationService } from './verification.service';
@Injectable()
export class CertificationService {
 private readonly root=join(resolve(process.cwd(),'..','..'),'.avos','evidence','avos-mobility-unified-mvp');
 constructor(private readonly verification:VerificationService){mkdirSync(this.root,{recursive:true});}
 certify(d:CertificationDto){const approvedBy=d?.approvedBy?.trim();if(!approvedBy)throw new BadRequestException('approvedBy is required by Human Final Authority.');const verification=this.verification.verify();const t=Date.now();const evidencePath=join(this.root,`mobility-mvp-certification-${t}.json`);const result={id:`avos-mobility-unified-mvp-certification-${t}`,name:'AVOS Mobility — Unified MVP Mega Pack 1',version:verification.version,status:verification.status==='passed'?'certified':'blocked',score:verification.score,approvedBy,notes:d.notes?.trim()||null,checks:{...verification.checks,productUsable:verification.status==='passed',platformIntegrated:verification.status==='passed'},certifiedAt:new Date().toISOString(),evidencePath};writeFileSync(evidencePath,JSON.stringify({result,verification},null,2),'utf8');return result;}
}
