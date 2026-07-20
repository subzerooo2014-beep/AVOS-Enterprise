import { Injectable } from '@nestjs/common';
import { AeosExecutionContext } from '../contracts/aeos-mega-pack-2.contracts';
import { Aeos13Service } from '../stages/aeos-1.3/aeos-1.3.service';
import { Aeos14Service } from '../stages/aeos-1.4/aeos-1.4.service';
import { Aeos15Service } from '../stages/aeos-1.5/aeos-1.5.service';
import { Aeos16Service } from '../stages/aeos-1.6/aeos-1.6.service';
import { Aeos17Service } from '../stages/aeos-1.7/aeos-1.7.service';
import { Aeos18Service } from '../stages/aeos-1.8/aeos-1.8.service';
import { Aeos19Service } from '../stages/aeos-1.9/aeos-1.9.service';
import { KnowledgeFabricAdapterService } from '../integration/knowledge-fabric-adapter.service';
import { CapabilityFabricAdapterService } from '../integration/capability-fabric-adapter.service';
import { EnterpriseBrainAdapterService } from '../integration/enterprise-brain-adapter.service';
import { AvosFactoryAdapterService } from '../integration/avos-factory-adapter.service';

@Injectable()
export class AeosUnifiedRuntimeService {
  constructor(
    private readonly aeos13: Aeos13Service,
    private readonly aeos14: Aeos14Service,
    private readonly aeos15: Aeos15Service,
    private readonly aeos16: Aeos16Service,
    private readonly aeos17: Aeos17Service,
    private readonly aeos18: Aeos18Service,
    private readonly aeos19: Aeos19Service,
    private readonly knowledgefabric: KnowledgeFabricAdapterService,
    private readonly capabilityfabric: CapabilityFabricAdapterService,
    private readonly enterprisebrain: EnterpriseBrainAdapterService,
    private readonly avosfactory: AvosFactoryAdapterService,
  ) {}

  execute(context: AeosExecutionContext): Record<string, unknown> {
    const stages = [
      this.aeos13.execute(context),
      this.aeos14.execute(context),
      this.aeos15.execute(context),
      this.aeos16.execute(context),
      this.aeos17.execute(context),
      this.aeos18.execute(context),
      this.aeos19.execute(context),
    ];
    return {
      name: 'AEOS Mega Pack 2 Unified Runtime',
      version: 'AEOS-2.0.0',
      status: 'operational',
      objective: context.objective,
      stages,
      aggregateScore: Math.round(stages.reduce((sum, item) => sum + item.score, 0) / stages.length),
      requiresHumanApproval: stages.some((item) => item.gate.requiresHumanApproval),
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      executedAt: new Date().toISOString(),
    };
  }

  integrationHealth(): Record<string, unknown>[] {
    return [
      this.knowledgefabric.health(),
      this.capabilityfabric.health(),
      this.enterprisebrain.health(),
      this.avosfactory.health(),
    ];
  }
}
