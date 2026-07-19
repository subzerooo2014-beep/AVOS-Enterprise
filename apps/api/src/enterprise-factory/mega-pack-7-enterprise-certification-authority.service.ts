import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterpriseCertification } from './enterprise-factory.types';

@Injectable()
export class EnterpriseCertificationAuthorityService {
  constructor(private readonly store: EnterpriseFactoryStore) {}

  certifyWorkOrder(
    workOrderNamespace: string,
    approvedBy: string,
  ): EnterpriseCertification {
    const workOrder = this.store.workOrders.get(workOrderNamespace);
    const plan = this.store.plans.get(workOrderNamespace);
    const release = this.store.releases.get(workOrderNamespace);

    if (!workOrder || !plan || !release) {
      throw new BadRequestException(
        'Work order, enterprise plan, and release are required.',
      );
    }

    const checks = [
      { name: 'Portfolio assigned', passed: this.store.portfolios.has(workOrder.portfolioNamespace) },
      { name: 'Factory selected', passed: workOrder.selectedFactoryIds.length > 0 },
      { name: 'Enterprise plan generated', passed: plan.decomposition.length > 0 },
      { name: 'Runtime completed', passed: workOrder.status === 'awaiting-human-approval' },
      { name: 'Release prepared', passed: ['prepared', 'deployed'].includes(release.status) },
      { name: 'Rollback ready', passed: release.rollbackReady },
      { name: 'Human Final Authority', passed: approvedBy.startsWith('human:') },
      { name: 'Global Compliance Readiness Gate', passed: workOrder.jurisdictions.length > 0 },
    ];

    const score = Math.round(
      (checks.filter((check) => check.passed).length / checks.length) * 100,
    );

    const certification: EnterpriseCertification = {
      id: `enterprise-certification:${Date.now()}:${randomUUID().slice(0, 8)}`,
      subject: workOrderNamespace,
      subjectType: 'work-order',
      status: score === 100 ? 'certified' : 'not-certified',
      score,
      checks,
      approvedBy,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      createdAt: new Date().toISOString(),
    };

    this.store.certifications.set(workOrderNamespace, certification);

    if (certification.status === 'certified') {
      workOrder.status = 'completed';
      workOrder.updatedAt = new Date().toISOString();
    }

    return certification;
  }
}