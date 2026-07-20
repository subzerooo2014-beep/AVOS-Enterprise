import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { AgpProductionPlatformCertificationService } from "./certification/agp-production-platform-certification.service";
import { AgpConnectorSdkService } from "./external/agp-connector-sdk.service";
import { AgpProductionPlatformHealthService } from "./health/agp-production-platform-health.service";
import { AgpEnterprisePlatformIntegrationService } from "./internal/agp-enterprise-platform-integration.service";
import { AgpIntegrationRegistryService } from "./registry/agp-integration-registry.service";
import { AgpRuntimeDeploymentOperationsService } from "./runtime/agp-runtime-deployment-operations.service";
import { AgpProductionIntegrationSmokeService } from "./smoke/agp-production-integration-smoke.service";
import { AgpProductionIntegrationVerificationService } from "./verification/agp-production-integration-verification.service";

@Controller("avos/agp/production-integration/mega-pack-13-15")
export class AgpProductionIntegrationMegaPack1315Controller {
  constructor(
    private readonly registry: AgpIntegrationRegistryService,
    private readonly internal: AgpEnterprisePlatformIntegrationService,
    private readonly external: AgpConnectorSdkService,
    private readonly runtime: AgpRuntimeDeploymentOperationsService,
    private readonly health: AgpProductionPlatformHealthService,
    private readonly verification: AgpProductionIntegrationVerificationService,
    private readonly smoke: AgpProductionIntegrationSmokeService,
    private readonly certification: AgpProductionPlatformCertificationService,
  ) {}

  @Get("status")
  status() {
    return this.health.status();
  }

  @Get("integrations")
  integrations() {
    return this.registry.list();
  }

  @Post("internal/execute")
  executeInternal(@Body() body: {
    integrationKey: string;
    operation: string;
    request: unknown;
  }) {
    return this.internal.execute(
      body.integrationKey,
      body.operation,
      body.request,
    );
  }

  @Post("events/publish")
  publishEvent(@Body() body: any) {
    return this.internal.publishEvent(body);
  }

  @Post("workflows/start")
  startWorkflow(@Body() body: any) {
    return this.internal.startWorkflow(body);
  }

  @Post("memory/write")
  writeMemory(@Body() body: any) {
    return this.internal.writeMemory(body);
  }

  @Post("decisions/record")
  recordDecision(@Body() body: any) {
    return this.internal.recordDecision(body);
  }

  @Get("connectors")
  connectors() {
    return this.external.list();
  }

  @Post("connectors/:key/execute")
  executeConnector(
    @Param("key") key: string,
    @Body() body: {
      operation: string;
      request: unknown;
    },
  ) {
    return this.external.execute(
      key,
      body.operation,
      body.request,
    );
  }

  @Post("webhooks/receive")
  receiveWebhook(@Body() body: any) {
    return this.external.receiveWebhook(body);
  }

  @Get("runtime/environments")
  environments() {
    return this.runtime.listEnvironments();
  }

  @Post("runtime/environments")
  upsertEnvironment(@Body() body: any) {
    return this.runtime.upsertEnvironment(body);
  }

  @Post("runtime/deployments")
  planDeployment(@Body() body: any) {
    return this.runtime.planDeployment(body);
  }

  @Post("runtime/deployments/:id/approve")
  approveDeployment(
    @Param("id") id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.runtime.approveDeployment(
      id,
      body.approvedBy,
    );
  }

  @Post("runtime/deployments/:id/execute")
  executeDeployment(@Param("id") id: string) {
    return this.runtime.executeDeployment(id);
  }

  @Post("runtime/deployments/:id/rollback")
  rollbackDeployment(
    @Param("id") id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.runtime.rollbackDeployment(
      id,
      body.approvedBy,
    );
  }

  @Post("runtime/workers")
  registerWorker(@Body() body: any) {
    return this.runtime.registerWorker(body);
  }

  @Post("runtime/jobs")
  scheduleJob(@Body() body: any) {
    return this.runtime.scheduleJob(body);
  }

  @Post("runtime/backups")
  backup(@Body() body: any) {
    return this.runtime.backup(body);
  }

  @Post("runtime/migrations")
  migrate(@Body() body: any) {
    return this.runtime.migrate(body);
  }

  @Post("runtime/benchmark")
  benchmark(@Body() body: any) {
    return this.runtime.benchmark(body);
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Get("verification/status")
  verificationStatus() {
    return this.verification.status();
  }

  @Post("smoke/run")
  smokeTest() {
    return this.smoke.run();
  }

  @Get("smoke/status")
  smokeStatus() {
    return this.smoke.status();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.certification.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }

  @Get("certification/history")
  certificationHistory() {
    return this.certification.historyList();
  }
}