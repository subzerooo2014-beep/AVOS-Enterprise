import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterpriseDeploymentRelease } from './enterprise-factory.types';

@Injectable()
export class EnterpriseDeploymentCenterService {
  constructor(private readonly store: EnterpriseFactoryStore) {}

  prepare(input: {
    workOrderNamespace: string;
    environments: string[];
    strategy: EnterpriseDeploymentRelease['strategy'];
    releaseVersion: string;
    approvedBy: string;
  }): EnterpriseDeploymentRelease {
    const workOrder = this.store.workOrders.get(input.workOrderNamespace);
    if (!workOrder) {
      throw new BadRequestException(
        `Work order not found: ${input.workOrderNamespace}`,
      );
    }

    if (!input.approvedBy?.startsWith('human:')) {
      throw new BadRequestException('Human release approval is required.');
    }

    const release: EnterpriseDeploymentRelease = {
      id: `enterprise-release:${Date.now()}:${randomUUID().slice(0, 8)}`,
      workOrderId: workOrder.id,
      environments: [...new Set(input.environments)],
      strategy: input.strategy,
      releaseVersion: input.releaseVersion,
      rollbackReady: true,
      status: 'prepared',
      approvedBy: input.approvedBy,
      createdAt: new Date().toISOString(),
    };

    this.store.releases.set(input.workOrderNamespace, release);
    return release;
  }

  deploy(workOrderNamespace: string): EnterpriseDeploymentRelease {
    const release = this.store.releases.get(workOrderNamespace);
    if (!release) {
      throw new BadRequestException(`Release not found: ${workOrderNamespace}`);
    }

    release.status = 'deployed';
    return release;
  }

  rollback(workOrderNamespace: string): EnterpriseDeploymentRelease {
    const release = this.store.releases.get(workOrderNamespace);
    if (!release) {
      throw new BadRequestException(`Release not found: ${workOrderNamespace}`);
    }

    release.status = 'rolled-back';
    return release;
  }
}