import { Injectable } from '@nestjs/common';
import { AeosStageDescriptor } from '../contracts/aeos-mega-pack-2.contracts';
import { Aeos13Service } from '../stages/aeos-1.3/aeos-1.3.service';
import { Aeos14Service } from '../stages/aeos-1.4/aeos-1.4.service';
import { Aeos15Service } from '../stages/aeos-1.5/aeos-1.5.service';
import { Aeos16Service } from '../stages/aeos-1.6/aeos-1.6.service';
import { Aeos17Service } from '../stages/aeos-1.7/aeos-1.7.service';
import { Aeos18Service } from '../stages/aeos-1.8/aeos-1.8.service';
import { Aeos19Service } from '../stages/aeos-1.9/aeos-1.9.service';

@Injectable()
export class AeosUnifiedRegistryService {
  constructor(
    private readonly aeos13: Aeos13Service,
    private readonly aeos14: Aeos14Service,
    private readonly aeos15: Aeos15Service,
    private readonly aeos16: Aeos16Service,
    private readonly aeos17: Aeos17Service,
    private readonly aeos18: Aeos18Service,
    private readonly aeos19: Aeos19Service,
  ) {}

  stages(): AeosStageDescriptor[] {
    return [
      this.aeos13.descriptor(),
      this.aeos14.descriptor(),
      this.aeos15.descriptor(),
      this.aeos16.descriptor(),
      this.aeos17.descriptor(),
      this.aeos18.descriptor(),
      this.aeos19.descriptor(),
    ];
  }

  status(): Record<string, unknown> {
    const stages = this.stages();
    return {
      total: stages.length,
      operational: stages.filter((stage) => stage.status === 'operational').length,
      stages,
      humanFinalAuthority: stages.every((stage) => stage.humanFinalAuthority),
      globalComplianceReadinessGate: stages.every((stage) => stage.globalComplianceReadinessGate),
    };
  }
}
