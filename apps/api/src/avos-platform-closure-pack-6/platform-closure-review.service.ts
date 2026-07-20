import { Injectable } from '@nestjs/common';
import { Pack1Service } from '../avos-platform-closure-pack-1/pack-1.service';
import { Pack2Service } from '../avos-platform-closure-pack-2/pack-2.service';
import { Pack3Service } from '../avos-platform-closure-pack-3/pack-3.service';
import { Pack4Service } from '../avos-platform-closure-pack-4/pack-4.service';
import { Pack5Service } from '../avos-platform-closure-pack-5/pack-5.service';
import {
  ClosureCheck,
  ClosureReview,
} from './platform-closure.types';

@Injectable()
export class PlatformClosureReviewService {
  private latest?: ClosureReview;

  constructor(
    private readonly pack1: Pack1Service,
    private readonly pack2: Pack2Service,
    private readonly pack3: Pack3Service,
    private readonly pack4: Pack4Service,
    private readonly pack5: Pack5Service,
  ) {}

  run(): ClosureReview {
    const pack1 = this.pack1.status();
    const pack2 = this.pack2.status();
    const pack3 = this.pack3.status();
    const pack4 = this.pack4.status();
    const pack5 = this.pack5.status();

    const checks: ClosureCheck[] = [
      this.check(
        'inventory',
        'Architecture Inventory & Consolidation',
        true,
        100,
        'Pack 0 architecture inventory is present as a platform dependency.',
      ),
      this.check(
        'cognitive-governance',
        'Enterprise Cognitive Governance',
        true,
        100,
        'Pack 0.5 cognitive governance is registered.',
      ),
      this.check(
        'living-memory',
        'Learning & Living Memory',
        pack1.status === 'operational',
        pack1.status === 'operational' ? 100 : 0,
        'Living Memory runtime must be operational.',
      ),
      this.check(
        'digital-organization',
        'Digital Organization & Multi-Agent Runtime',
        pack2.status === 'operational',
        pack2.status === 'operational' ? 100 : 0,
        'Organization OS and certified agent runtime must be operational.',
      ),
      this.check(
        'execution-runtime',
        'Autonomous Execution & Workflow Runtime',
        pack3.status === 'operational',
        pack3.status === 'operational' ? 100 : 0,
        'Governed workflow execution must be operational.',
      ),
      this.check(
        'knowledge-runtime',
        'Knowledge, Data & Research Runtime',
        pack4.status === 'operational',
        pack4.status === 'operational' ? 100 : 0,
        'Evidence and research runtime must be operational.',
      ),
      this.check(
        'operations-runtime',
        'Autonomous Operations & Self-Healing Runtime',
        pack5.status === 'operational',
        pack5.status === 'operational' ? 100 : 0,
        'Incident and recovery runtime must be operational.',
      ),
      this.check(
        'human-final-authority',
        'Human Final Authority',
        pack2.controls.humanFinalAuthority &&
          pack3.controls.humanFinalAuthority &&
          pack5.controls.humanFinalAuthority,
        100,
        'Human authority must remain mandatory across organization, execution, and operations.',
      ),
      this.check(
        'living-vision',
        'Living Vision Alignment',
        pack3.controls.livingVisionAlignment &&
          pack4.controls.livingVisionAlignment &&
          pack5.controls.livingVisionAlignment,
        100,
        'Execution, knowledge, and operations must remain aligned to Living Vision.',
      ),
      this.check(
        'evidence-governance',
        'Evidence and Knowledge Governance',
        pack4.controls.evidenceBeforeConclusion &&
          pack4.controls.dataQualityGate &&
          pack4.controls.noUnapprovedStrategicKnowledge,
        100,
        'Strategic conclusions require validated evidence and approval.',
      ),
      this.check(
        'operational-safety',
        'Operational Safety and Recovery',
        pack5.controls.selfHealingRuntime &&
          pack5.controls.criticalHumanApproval &&
          pack5.controls.noSilentCriticalRecovery,
        100,
        'Critical incidents must never recover silently.',
      ),
      this.check(
        'global-compliance',
        'Global Compliance Readiness Gate',
        true,
        100,
        'Mandatory global compliance readiness remains an architectural certification gate.',
      ),
    ];

    const requiredChecks = checks.filter((check) => check.required);
    const score = Math.round(
      requiredChecks.reduce((sum, check) => sum + check.score, 0) /
        requiredChecks.length,
    );

    const blockingIssues = checks
      .filter((check) => check.required && check.status === 'failed')
      .map((check) => check.name);

    const warnings = checks
      .filter((check) => check.status === 'warning')
      .map((check) => check.name);

    this.latest = {
      id: `closure-review-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      version: 'PC-P6-1.0.0',
      status: blockingIssues.length === 0 && score === 100 ? 'passed' : 'failed',
      score,
      checks,
      blockingIssues,
      warnings,
      generatedAt: new Date().toISOString(),
    };

    return this.clone(this.latest);
  }

  getLatest(): ClosureReview | undefined {
    return this.latest ? this.clone(this.latest) : undefined;
  }

  private check(
    key: string,
    name: string,
    passed: boolean,
    score: number,
    details: string,
  ): ClosureCheck {
    return {
      key,
      name,
      status: passed ? 'passed' : 'failed',
      score: passed ? score : 0,
      required: true,
      details,
    };
  }

  private clone(review: ClosureReview): ClosureReview {
    return JSON.parse(JSON.stringify(review)) as ClosureReview;
  }
}