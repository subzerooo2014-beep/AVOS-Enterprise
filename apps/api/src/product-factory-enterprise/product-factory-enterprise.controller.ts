import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DeploymentRuntimeService } from './deployment-runtime.service';
import { ProductDigitalTwinService } from './product-digital-twin.service';
import { ProductEcosystemService } from './product-ecosystem.service';
import { ProductEvolutionService } from './product-evolution.service';
import { ProductFactoryEnterpriseVerificationService } from './product-factory-enterprise-verification.service';
import {
  DeploymentRequest,
  EvolutionSignal,
  MarketplaceRecord,
} from './product-factory-enterprise.types';

@Controller('avos/product-factory/enterprise')
export class ProductFactoryEnterpriseController {
  constructor(
    private readonly runtime: DeploymentRuntimeService,
    private readonly evolution: ProductEvolutionService,
    private readonly twin: ProductDigitalTwinService,
    private readonly ecosystem: ProductEcosystemService,
    private readonly verification: ProductFactoryEnterpriseVerificationService,
  ) {}

  @Get('status')
  status() {
    return {
      name: 'AVOS Product Factory Ultimate Enterprise',
      version: 'PF-ENTERPRISE-2.5.0',
      status: 'operational',
      stagesConsolidated: [
        'Deployment Runtime and Lifecycle',
        'Autonomous Product Evolution',
        'Product Intelligence and Digital Twin',
        'Autonomous Product Ecosystem',
      ],
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      runtimeMetrics: this.runtime.metrics(),
      ecosystemMetrics: this.ecosystem.ecosystemMetrics(),
    };
  }

  @Post('runtime/deploy')
  deploy(@Body() request: DeploymentRequest) {
    return this.runtime.deploy(request);
  }

  @Post('runtime/start')
  start(@Body() body: { namespace: string; version?: string }) {
    return this.runtime.start(body.namespace, body.version);
  }

  @Post('runtime/stop')
  stop(@Body() body: { namespace: string; version?: string }) {
    return this.runtime.stop(body.namespace, body.version);
  }

  @Post('runtime/restart')
  restart(@Body() body: { namespace: string; version?: string }) {
    return this.runtime.restart(body.namespace, body.version);
  }

  @Post('runtime/rollback')
  rollback(@Body() body: { namespace: string }) {
    return this.runtime.rollback(body.namespace);
  }

  @Post('runtime/retire')
  retire(@Body() body: { namespace: string; version?: string }) {
    return this.runtime.retire(body.namespace, body.version);
  }

  @Get('runtime/products')
  products() {
    return this.runtime.list();
  }

  @Get('runtime/:namespace/status')
  runtimeStatus(
    @Param('namespace') namespace: string,
    @Query('version') version?: string,
  ) {
    return this.runtime.status(namespace, version);
  }

  @Get('runtime/metrics')
  runtimeMetrics() {
    return this.runtime.metrics();
  }

  @Post('evolution/signals')
  signal(@Body() body: Omit<EvolutionSignal, 'id' | 'createdAt'>) {
    return this.evolution.ingestSignal(body);
  }

  @Post('evolution/analyze')
  analyze(@Body() body: { namespace: string }) {
    return this.evolution.analyze(body.namespace);
  }

  @Post('evolution/approve')
  approveEvolution(@Body() body: { id: string; approvedBy: string }) {
    return this.evolution.approve(body.id, body.approvedBy);
  }

  @Get('evolution/proposals')
  proposals(@Query('namespace') namespace?: string) {
    return this.evolution.list(namespace);
  }

  @Post('twin/:namespace/synchronize')
  synchronizeTwin(@Param('namespace') namespace: string) {
    return this.twin.synchronize(namespace);
  }

  @Get('twin/:namespace')
  getTwin(@Param('namespace') namespace: string) {
    return this.twin.get(namespace);
  }

  @Post('twin/:namespace/impact')
  impact(
    @Param('namespace') namespace: string,
    @Body() body: { change: string },
  ) {
    return this.twin.impact(namespace, body.change);
  }

  @Post('ecosystem/register')
  registerMarketplace(
    @Body() body: Omit<MarketplaceRecord, 'id' | 'status'>,
  ) {
    return this.ecosystem.register(body);
  }

  @Post('ecosystem/publish')
  publish(@Body() body: { id: string; approvedBy: string }) {
    return this.ecosystem.publish(body.id, body.approvedBy);
  }

  @Post('ecosystem/suspend')
  suspend(@Body() body: { id: string }) {
    return this.ecosystem.suspend(body.id);
  }

  @Get('ecosystem/products')
  marketplaceProducts() {
    return this.ecosystem.list();
  }

  @Get('ecosystem/metrics')
  ecosystemMetrics() {
    return this.ecosystem.ecosystemMetrics();
  }

  @Post('verification/run')
  verify() {
    return this.verification.run();
  }

  @Post('smoke/run')
  smoke() {
    return this.verification.smoke();
  }

  @Post('certification/certify')
  certify(@Body() body: { approvedBy: string }) {
    return this.verification.certify(body.approvedBy);
  }
}