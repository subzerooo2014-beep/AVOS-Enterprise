import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductFactoryService } from './product-factory.service';
import { FactoryRegistryService } from './factory-registry.service';
import { FactoryTemplateCatalogService } from './factory-template-catalog.service';
import { FactoryOrchestratorService } from './factory-orchestrator.service';
import { FactoryAuditService } from './factory-audit.service';
import { FactoryBuildRequest } from './product-factory.types';
import { FactoryHealthService } from './factory-health.service';
import { FactoryMetricsService } from './factory-metrics.service';

@Controller('avos/product-factory')
export class ProductFactoryController {
  constructor(
    private readonly factory: ProductFactoryService,
    private readonly registry: FactoryRegistryService,
    private readonly templates: FactoryTemplateCatalogService,
    private readonly orchestrator: FactoryOrchestratorService,
    private readonly audit: FactoryAuditService,
    private readonly healthService: FactoryHealthService,
    private readonly metricsService: FactoryMetricsService,
  ) {}

  @Get('status')
  status() {
    return this.factory.status();
  }

  @Get('health')
  health() {
    return this.healthService.health();
  }

  @Get('metrics')
  metrics() {
    return this.metricsService.snapshot();
  }

  @Get('dashboard')
  dashboard() {
    return {
      status: this.factory.status(),
      builds: this.registry.listBuilds(),
      templates: this.templates.list(),
      metrics: this.registry.metrics(),
      audit: this.audit.list(),
    };
  }

  @Get('templates')
  listTemplates() {
    return this.templates.list();
  }

  @Get('templates/:id')
  getTemplate(@Param('id') id: string) {
    return this.templates.get(id);
  }

  @Get('builds')
  listBuilds() {
    return this.registry.listBuilds();
  }

  @Get('builds/:id')
  getBuild(@Param('id') id: string) {
    return this.registry.getBuild(id);
  }

  @Post('build')
  build(@Body() request: FactoryBuildRequest) {
    return this.orchestrator.buildProduct(request);
  }

  @Post('builds/:id/rollback')
  rollback(@Param('id') id: string) {
    return this.orchestrator.rollback(id);
  }

  @Post('verification/run')
  verify() {
    return this.factory.verify();
  }

  @Post('smoke/run')
  smoke() {
    return this.factory.smoke();
  }

  @Post('certification/certify')
  certify(@Body() body: { approvedBy?: string }) {
    return this.factory.certify(body?.approvedBy ?? 'human:khalifa');
  }
}