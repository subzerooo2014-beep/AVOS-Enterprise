import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterprisePlan } from './enterprise-factory.types';

@Injectable()
export class EnterpriseAiPlanningEngineService {
  constructor(private readonly store: EnterpriseFactoryStore) {}

  plan(workOrderNamespace: string): EnterprisePlan {
    const workOrder = this.store.workOrders.get(workOrderNamespace);
    if (!workOrder) {
      throw new BadRequestException(`Work order not found: ${workOrderNamespace}`);
    }

    const decomposition = workOrder.requestedProducts.map((product) => ({
      productNamespace: product,
      purpose: `Deliver ${product} for objective: ${workOrder.objective}`,
      capabilities: [...workOrder.requiredCapabilities],
      recommendedStack: [
        'NestJS',
        'Next.js',
        'PostgreSQL',
        'Prisma',
        'AVOS Product Factory',
      ],
    }));

    const resources = [...this.store.resources.values()];
    const reuseCandidates = resources
      .filter((resource) =>
        resource.tags.some((tag) =>
          workOrder.requiredCapabilities.some((capability) =>
            capability.toLowerCase().includes(tag.toLowerCase()),
          ),
        ),
      )
      .map((resource) => resource.name);

    const risks = [
      ...(workOrder.jurisdictions.includes('GLOBAL')
        ? ['Cross-jurisdiction regulatory variance']
        : []),
      ...(workOrder.requestedProducts.length > 3
        ? ['Large multi-product coordination scope']
        : []),
      ...(reuseCandidates.length === 0
        ? ['Limited reusable enterprise assets detected']
        : []),
    ];

    const confidence = Math.max(
      0.55,
      Math.min(0.95, 0.72 + reuseCandidates.length * 0.03 - risks.length * 0.02),
    );

    const plan: EnterprisePlan = {
      id: `enterprise-plan:${Date.now()}:${randomUUID().slice(0, 8)}`,
      workOrderId: workOrder.id,
      decomposition,
      reuseCandidates,
      risks,
      confidence,
      requiresHumanApproval: true,
      createdAt: new Date().toISOString(),
    };

    this.store.plans.set(workOrderNamespace, plan);
    return plan;
  }
}