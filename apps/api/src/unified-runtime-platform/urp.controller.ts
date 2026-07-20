import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { UrpBootstrapService } from "./urp-bootstrap.service";
import { UrpConfigurationService } from "./urp-configuration.service";
import { UrpDiagnosticsService } from "./urp-diagnostics.service";
import { UrpFeatureFlagsService } from "./urp-feature-flags.service";
import { UrpHealthCenterService } from "./urp-health-center.service";
import { UrpLifecycleManagerService } from "./urp-lifecycle-manager.service";
import { UrpResourceManagerService } from "./urp-resource-manager.service";
import { UrpRouterService } from "./urp-router.service";
import { UrpRuntimeContextService } from "./urp-runtime-context.service";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";
import { UrpVersionManagerService } from "./urp-version-manager.service";
import { UrpVerificationService } from "./urp-verification.service";
import { UrpCertificationService } from "./urp-certification.service";

@Controller("avos/runtime")
export class UrpController {
  constructor(
    private readonly context: UrpRuntimeContextService,
    private readonly registry: UrpRuntimeRegistryService,
    private readonly lifecycle: UrpLifecycleManagerService,
    private readonly bootstrap: UrpBootstrapService,
    private readonly router: UrpRouterService,
    private readonly resources: UrpResourceManagerService,
    private readonly health: UrpHealthCenterService,
    private readonly diagnostics: UrpDiagnosticsService,
    private readonly config: UrpConfigurationService,
    private readonly flags: UrpFeatureFlagsService,
    private readonly versions: UrpVersionManagerService,
    private readonly verification: UrpVerificationService,
    private readonly certification: UrpCertificationService,
  ) {}

  @Get("status")
  status() {
    return {
      name: "AVOS Unified Runtime Platform",
      version: "URP-1.0.0",
      status: "operational",
      context: this.context.status(),
      registry: this.registry.snapshot(),
    };
  }

  @Post("boot")
  boot() {
    return this.bootstrap.boot();
  }

  @Get("boot/status")
  bootStatus() {
    return this.bootstrap.status();
  }

  @Get("registry")
  registryList() {
    return this.registry.list();
  }

  @Get("registry/:key")
  registryItem(@Param("key") key: string) {
    return this.registry.get(key);
  }

  @Get("dependencies/validate")
  dependencies() {
    return this.registry.validateDependencies();
  }

  @Post("lifecycle/:key/start")
  start(@Param("key") key: string) {
    return this.lifecycle.start(key);
  }

  @Post("lifecycle/:key/stop")
  stop(@Param("key") key: string) {
    return this.lifecycle.stop(key);
  }

  @Post("route/command")
  command(@Body() input: Parameters<UrpRouterService["command"]>[0]) {
    return this.router.command(input);
  }

  @Post("route/query")
  query(@Body() input: Parameters<UrpRouterService["query"]>[0]) {
    return this.router.query(input);
  }

  @Post("events")
  publish(@Body() input: Parameters<UrpRouterService["publish"]>[0]) {
    return this.router.publish(input);
  }

  @Get("events")
  events(@Query("limit") limit?: string) {
    return this.router.recentEvents(limit ? Number(limit) : 100);
  }

  @Get("health")
  runtimeHealth() {
    return this.health.evaluate();
  }

  @Get("resources")
  resourceSnapshot() {
    return this.resources.snapshot();
  }

  @Get("diagnostics")
  runDiagnostics() {
    return this.diagnostics.run();
  }

  @Get("configuration")
  configuration() {
    return this.config.snapshot();
  }

  @Post("configuration/:key")
  setConfiguration(
    @Param("key") key: string,
    @Body() input: { value: unknown; approvedBy: string },
  ) {
    return this.config.set(key, input.value, input.approvedBy);
  }

  @Get("feature-flags")
  featureFlags() {
    return this.flags.snapshot();
  }

  @Post("feature-flags/:key")
  setFeatureFlag(
    @Param("key") key: string,
    @Body() input: { enabled: boolean; approvedBy: string },
  ) {
    return this.flags.set(key, input.enabled, input.approvedBy);
  }

  @Get("versions")
  versionInventory() {
    return this.versions.inventory();
  }

  @Post("versions/:key/assess-upgrade")
  assessUpgrade(
    @Param("key") key: string,
    @Body() input: { targetVersion: string; approvedBy?: string },
  ) {
    return this.versions.assessUpgrade(
      key,
      input.targetVersion,
      input.approvedBy,
    );
  }
  @Post("verification/run")
  verify() {
    return this.verification.run();
  }
  @Post("certification/certify")
  certify(@Body() input: { approvedBy?: string }) {
    return this.certification.certify(input?.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}