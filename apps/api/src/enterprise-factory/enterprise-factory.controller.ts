import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterpriseFactoryOrchestratorService } from './enterprise-factory-orchestrator.service';
import { EnterpriseFactoryFoundationService } from './mega-pack-1-enterprise-factory-foundation.service';
import { EnterprisePortfolioResourceManagerService } from './mega-pack-2-portfolio-resource-manager.service';
import { EnterpriseOrchestratorService } from './mega-pack-3-enterprise-orchestrator.service';
import { MultiFactoryRuntimeService } from './mega-pack-4-multi-factory-runtime.service';
import { EnterpriseAiPlanningEngineService } from './mega-pack-5-enterprise-ai-planning-engine.service';
import { EnterpriseDeploymentCenterService } from './mega-pack-6-enterprise-deployment-center.service';
import { EnterpriseCertificationAuthorityService } from './mega-pack-7-enterprise-certification-authority.service';
import { EnterpriseFactoryFinalIntegrationCertificationService } from './mega-pack-8-final-integration-certification.service';

@Controller('avos/enterprise-factory')
export class EnterpriseFactoryController {
  constructor(
    private readonly store: EnterpriseFactoryStore,
    private readonly foundation: EnterpriseFactoryFoundationService,
    private readonly portfolioManager: EnterprisePortfolioResourceManagerService,
    private readonly orchestrator: EnterpriseOrchestratorService,
    private readonly runtime: MultiFactoryRuntimeService,
    private readonly planning: EnterpriseAiPlanningEngineService,
    private readonly deployment: EnterpriseDeploymentCenterService,
    private readonly certification: EnterpriseCertificationAuthorityService,
    private readonly finalIntegration: EnterpriseFactoryFinalIntegrationCertificationService,
    private readonly enterpriseExecution: EnterpriseFactoryOrchestratorService,
  ) {}

  @Get('status')
  status() {
    this.foundation.ensureProductFactory();
    return this.finalIntegration.status();
  }

  @Post('factories/register')
  registerFactory(@Body() body: Parameters<EnterpriseFactoryFoundationService['register']>[0]) {
    return this.foundation.register(body);
  }

  @Get('factories')
  factories() {
    return this.foundation.list();
  }

  @Post('portfolios')
  createPortfolio(
    @Body()
    body: Parameters<EnterprisePortfolioResourceManagerService['createPortfolio']>[0],
  ) {
    return this.portfolioManager.createPortfolio(body);
  }

  @Get('portfolios')
  portfolios() {
    return this.portfolioManager.listPortfolios();
  }

  @Post('resources')
  registerResource(
    @Body()
    body: Parameters<EnterprisePortfolioResourceManagerService['registerResource']>[0],
  ) {
    return this.portfolioManager.registerResource(body);
  }

  @Get('resources')
  resources() {
    return this.portfolioManager.listResources();
  }

  @Post('work-orders')
  createWorkOrder(@Body() body: Parameters<EnterpriseOrchestratorService['createWorkOrder']>[0]) {
    return this.orchestrator.createWorkOrder(body);
  }

  @Post('work-orders/:namespace/queue')
  queue(@Param('namespace') namespace: string) {
    return this.orchestrator.queue(namespace);
  }

  @Post('work-orders/:namespace/start')
  start(@Param('namespace') namespace: string) {
    return this.runtime.start(namespace);
  }

  @Post('work-orders/:namespace/complete')
  complete(@Param('namespace') namespace: string) {
    return this.runtime.complete(namespace);
  }

  @Post('work-orders/:namespace/plan')
  plan(@Param('namespace') namespace: string) {
    return this.planning.plan(namespace);
  }

  @Get('runtime')
  runtimeStatus() {
    return this.runtime.runtimeStatus();
  }

  @Post('releases')
  prepareRelease(
    @Body()
    body: Parameters<EnterpriseDeploymentCenterService['prepare']>[0],
  ) {
    return this.deployment.prepare(body);
  }

  @Post('releases/:namespace/deploy')
  deploy(@Param('namespace') namespace: string) {
    return this.deployment.deploy(namespace);
  }

  @Post('releases/:namespace/rollback')
  rollback(@Param('namespace') namespace: string) {
    return this.deployment.rollback(namespace);
  }

  @Post('certifications/work-orders/:namespace')
  certifyWorkOrder(
    @Param('namespace') namespace: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.certification.certifyWorkOrder(namespace, body.approvedBy);
  }

  @Post('execute')
  execute(@Body() body: Parameters<EnterpriseFactoryOrchestratorService['execute']>[0]) {
    return this.enterpriseExecution.execute(body);
  }

  @Post('final-review/run')
  finalReview() {
    return this.finalIntegration.review();
  }

  @Post('certification/certify')
  certifyEnterpriseFactory(@Body() body: { approvedBy: string }) {
    return this.finalIntegration.certify(body.approvedBy);
  }

  @Get('snapshot')
  snapshot() {
    return {
      factories: [...this.store.factories.values()],
      portfolios: [...this.store.portfolios.values()],
      resources: [...this.store.resources.values()],
      workOrders: [...this.store.workOrders.values()],
      plans: [...this.store.plans.values()],
      releases: [...this.store.releases.values()],
      certifications: [...this.store.certifications.values()],
    };
  }
}