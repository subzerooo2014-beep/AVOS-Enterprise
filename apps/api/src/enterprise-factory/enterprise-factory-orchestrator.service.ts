import { Injectable } from '@nestjs/common';
import { EnterpriseFactoryFoundationService } from './mega-pack-1-enterprise-factory-foundation.service';
import { EnterprisePortfolioResourceManagerService } from './mega-pack-2-portfolio-resource-manager.service';
import { EnterpriseOrchestratorService } from './mega-pack-3-enterprise-orchestrator.service';
import { MultiFactoryRuntimeService } from './mega-pack-4-multi-factory-runtime.service';
import { EnterpriseAiPlanningEngineService } from './mega-pack-5-enterprise-ai-planning-engine.service';
import { EnterpriseDeploymentCenterService } from './mega-pack-6-enterprise-deployment-center.service';
import { EnterpriseCertificationAuthorityService } from './mega-pack-7-enterprise-certification-authority.service';

@Injectable()
export class EnterpriseFactoryOrchestratorService {
  constructor(
    private readonly foundation: EnterpriseFactoryFoundationService,
    private readonly portfolioManager: EnterprisePortfolioResourceManagerService,
    private readonly orchestrator: EnterpriseOrchestratorService,
    private readonly runtime: MultiFactoryRuntimeService,
    private readonly planning: EnterpriseAiPlanningEngineService,
    private readonly deployment: EnterpriseDeploymentCenterService,
    private readonly certification: EnterpriseCertificationAuthorityService,
  ) {}

  execute(input: {
    portfolio: {
      namespace: string;
      name: string;
      strategy: string;
      owner: string;
      priority?: number;
    };
    workOrder: {
      namespace: string;
      objective: string;
      requestedProducts: string[];
      priority: number;
      requiredCapabilities: string[];
      jurisdictions: string[];
      approvedBy: string;
    };
    release: {
      environments: string[];
      strategy: 'rolling' | 'blue-green' | 'canary';
      releaseVersion: string;
      approvedBy: string;
    };
  }) {
    this.foundation.ensureProductFactory();

    const existingPortfolio = this.portfolioManager
      .listPortfolios()
      .find((portfolio) => portfolio.namespace === input.portfolio.namespace);

    const portfolio =
      existingPortfolio ?? this.portfolioManager.createPortfolio(input.portfolio);

    const workOrder = this.orchestrator.createWorkOrder({
      ...input.workOrder,
      portfolioNamespace: portfolio.namespace,
    });

    this.orchestrator.queue(workOrder.namespace);
    const plan = this.planning.plan(workOrder.namespace);
    this.runtime.start(workOrder.namespace);
    const runtimeCompletion = this.runtime.complete(workOrder.namespace);

    const release = this.deployment.prepare({
      workOrderNamespace: workOrder.namespace,
      ...input.release,
    });

    const certification = this.certification.certifyWorkOrder(
      workOrder.namespace,
      input.workOrder.approvedBy,
    );

    return {
      portfolio,
      workOrder: runtimeCompletion,
      plan,
      release,
      certification,
      enterpriseExecutionComplete: certification.status === 'certified',
    };
  }
}