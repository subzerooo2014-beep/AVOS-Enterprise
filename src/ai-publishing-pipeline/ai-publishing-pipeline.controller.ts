import { Controller, Get, Param, Post } from "@nestjs/common";
import { AiPublishingPipelineService } from "./ai-publishing-pipeline.service";

@Controller("ai-publishing-pipeline")
export class AiPublishingPipelineController {
  constructor(private readonly service: AiPublishingPipelineService) {}

  @Post("vehicle/:id/run")
  async run(@Param("id") id: string) {
    try {
      return await this.service.run(id);
    } catch (e: any) {
      return {
        failed: true,
        message: e?.message,
        stack: e?.stack,
        code: e?.code,
        meta: e?.meta,
      };
    }
  }

  @Get("vehicle/:id/preview")
  async preview(@Param("id") id: string) {
    return this.run(id);
  }
}
