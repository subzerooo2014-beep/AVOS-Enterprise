import { Injectable, NotFoundException } from '@nestjs/common';
import { ArchitectureIntelligenceService } from './architecture-intelligence.service';
import {
  SoftwareDevelopmentRun,
  SoftwareProjectRequest,
} from './avos-software-development-os.types';
import { DigitalOrganizationService } from './digital-organization.service';
import { EvolutionIntelligenceService } from './evolution-intelligence.service';
import { HumanFinalAuthorityService } from './human-final-authority.service';
import { LivingBlueprintService } from './living-blueprint.service';
import { SoftwareGenerationOrchestratorService } from './software-generation-orchestrator.service';
import { VerificationCertificationService } from './verification-certification.service';

@Injectable()
export class AvosSoftwareDevelopmentOsService {
  private readonly runs = new Map<string, SoftwareDevelopmentRun>();

  constructor(
    private readonly blueprint: LivingBlueprintService,
    private readonly organization: DigitalOrganizationService,
    private readonly architecture: ArchitectureIntelligenceService,
    private readonly orchestrator: SoftwareGenerationOrchestratorService,
    private readonly verification: VerificationCertificationService,
    private readonly evolution: EvolutionIntelligenceService,
    private readonly humanAuthority: HumanFinalAuthorityService,
  ) {}

  status() {
    return {
      name: 'AVOS Software Development Operating System',
      version: 'SDOS-OMEGA-1.0.0',
      status: 'operational',
      mission:
        'Design, build, verify, evolve, and govern enterprise software platforms.',
      principles: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        digitalOrganization: true,
        livingVisionIntegrated: true,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
      },
      activeRuns: this.runs.size,
      organization: this.organization.organizationMap(),
    };
  }

  createRun(request: SoftwareProjectRequest) {
    const blueprint = this.blueprint.create(request);
    const architectureReview = this.architecture.review(blueprint);
    const workItems = this.organization.createWorkforcePlan(blueprint);
    const executionPlan = this.orchestrator.prepare(workItems);
    const humanDecision = this.humanAuthority.initialDecision(
      request.strategicChange === true,
    );

    const now = new Date().toISOString();
    const run: SoftwareDevelopmentRun = {
      id: `sdos-run-${Date.now()}`,
      request,
      blueprint,
      workItems,
      state:
        humanDecision === 'pending' ? 'awaiting-human-approval' : 'planned',
      humanDecision,
      evidence: {
        architectureReview,
        executionPlan,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.runs.set(run.id, run);
    return run;
  }

  listRuns() {
    return Array.from(this.runs.values());
  }

  getRun(id: string) {
    const run = this.runs.get(id);
    if (!run) {
      throw new NotFoundException(`Software Development OS run ${id} not found.`);
    }
    return run;
  }

  approve(id: string, approvedBy: string) {
    const run = this.getRun(id);
    run.humanDecision = 'approved';
    run.state = 'approved';
    run.evidence = {
      ...run.evidence,
      humanApproval: {
        approvedBy,
        approvedAt: new Date().toISOString(),
      },
    };
    run.updatedAt = new Date().toISOString();
    return run;
  }

  execute(id: string) {
    const run = this.getRun(id);
    this.humanAuthority.assertApproved(run.humanDecision);

    run.state = 'executing';
    run.workItems = run.workItems.map((item) => ({
      ...item,
      state: 'executing',
    }));
    run.evidence = {
      ...run.evidence,
      execution: {
        mode: 'governed-orchestration',
        destructiveChangesAllowed: false,
        startedAt: new Date().toISOString(),
      },
    };
    run.updatedAt = new Date().toISOString();
    return run;
  }

  verify(id: string) {
    const run = this.getRun(id);
    const verification = this.verification.verify(run);
    run.state = verification.passed ? 'verified' : 'failed';
    run.evidence = { ...run.evidence, verification };
    run.updatedAt = new Date().toISOString();
    return run;
  }

  certify(id: string, approvedBy: string) {
    const run = this.getRun(id);
    const certification = this.verification.certify(run, approvedBy);
    run.state = 'certified';
    run.evidence = { ...run.evidence, certification };
    run.updatedAt = new Date().toISOString();
    return run;
  }

  evolutionAssessment(id: string) {
    return this.evolution.assess(this.getRun(id));
  }
}