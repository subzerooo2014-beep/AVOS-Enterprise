import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { DistributionEngineService } from "./distribution-engine.service";

@Controller("distribution-engine")
export class DistributionEngineController {
  constructor(private service: DistributionEngineService) {}

  @Post("channels")
  createChannel(@Body() body: any) {
    return this.service.createChannel(body);
  }

  @Get("channels")
  listChannels() {
    return this.service.listChannels();
  }

  @Post("publish-jobs")
  createJob(@Body() body: any) {
    return this.service.createPublishJob(body);
  }

  @Get("publish-jobs")
  listJobs() {
    return this.service.listJobs();
  }

  @Patch("publish-jobs/:id/published")
  published(@Param("id") id: string, @Body() body: any) {
    return this.service.markPublished(id, body);
  }

  @Post("publish-jobs/:id/auto-republish")
  republish(@Param("id") id: string, @Body() body: any) {
    return this.service.autoRepublish(id, body);
  }
}
