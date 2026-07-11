import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { PublisherDispatcherService } from "./publisher-dispatcher.service";
import { PublisherRegistryService } from "./publisher-registry.service";
import { PublisherMetricsService } from "./services/publisher-metrics.service";
import { PublisherStatsService } from "./services/publisher-stats.service";
import { PublisherJobAdminService } from "./services/publisher-job-admin.service";
import { PublisherDashboardService } from "./services/publisher-dashboard.service";
import { PublisherPreviewService } from "./services/publisher-preview.service";
import { PublisherSimulationService } from "./services/publisher-simulation.service";
import { PublisherUnlockService } from "./services/publisher-unlock.service";
import { CreatePublishJobDto, CreatePublishJobsBatchDto } from "./dto/create-publish-job.dto";
import { PublisherQueryDto } from "./dto/publisher-query.dto";

@Controller("publisher-engine")
export class PublisherEngineController {
  constructor(
    private readonly dispatcher: PublisherDispatcherService,
    private readonly registry: PublisherRegistryService,
    private readonly metrics: PublisherMetricsService,
    private readonly stats: PublisherStatsService,
    private readonly admin: PublisherJobAdminService,
    private readonly dashboardService: PublisherDashboardService,
    private readonly previewService: PublisherPreviewService,
    private readonly simulationService: PublisherSimulationService,
    private readonly unlockService: PublisherUnlockService,
  ) {}

  @Get("channels")
  channels() {
    return { success: true, version: "v2", channels: this.registry.list() };
  }

  @Get("health")
  health() {
    return this.dispatcher.health();
  }

  @Get("metrics")
  metricsSummary() {
    return this.metrics.summary();
  }

  @Get("stats/channels")
  channelStats() {
    return this.stats.byChannel();
  }

  @Get("dashboard")
  dashboard() {
    return this.dashboardService.dashboard();
  }

  @Get("jobs")
  jobs(@Query() query: PublisherQueryDto) {
    return this.admin.list(query);
  }

  @Get("job/:id")
  job(@Param("id") id: string) {
    return this.admin.get(id);
  }

  @Post("publish")
  publish(@Body() body: CreatePublishJobDto) {
    return this.admin.create(body);
  }

  @Post("publish-many")
  publishMany(@Body() body: CreatePublishJobsBatchDto) {
    return this.admin.createMany(Array.isArray(body?.items) ? body.items : []);
  }

  @Post("dispatch-queued")
  dispatchQueued(@Query("limit") limit?: string) {
    return this.dispatcher.dispatchQueued(limit ? Number(limit) : 20);
  }

  @Post("dispatch/:id")
  dispatchOne(@Param("id") id: string) {
    return this.dispatcher.dispatchOne(id);
  }

  @Post("retry/:id")
  retry(@Param("id") id: string) {
    return this.admin.retry(id);
  }

  @Post("retry-failed")
  retryFailed(@Query("limit") limit?: string) {
    return this.admin.retryFailed(limit ? Number(limit) : 50);
  }

  @Post("cancel/:id")
  cancel(@Param("id") id: string) {
    return this.admin.cancel(id);
  }

  @Post("preview")
  preview(@Body() body: any) {
    return this.previewService.preview(body);
  }

  @Post("simulate")
  simulate(@Body() body: any) {
    return this.simulationService.simulate(body);
  }

  @Post("unlock-expired")
  unlockExpired(@Query("minutes") minutes?: string) {
    return this.unlockService.unlockExpired(minutes ? Number(minutes) : 10);
  }
}
