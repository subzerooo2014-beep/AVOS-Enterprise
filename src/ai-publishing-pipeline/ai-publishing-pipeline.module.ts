import { Module } from "@nestjs/common";
import { AiDecisionModule } from "../ai-decision/ai-decision.module";
import { PublishJobsModule } from "../publish-jobs/publish-jobs.module";
import { AiActionLogModule } from "../ai-action-log/ai-action-log.module";
import { AiPublishingPipelineController } from "./ai-publishing-pipeline.controller";
import { AiPublishingPipelineService } from "./ai-publishing-pipeline.service";

@Module({
  imports: [
    AiDecisionModule,
    PublishJobsModule,
    AiActionLogModule,
  ],
  controllers: [
    AiPublishingPipelineController,
  ],
  providers: [
    AiPublishingPipelineService,
  ],
  exports: [
    AiPublishingPipelineService,
  ],
})
export class AiPublishingPipelineModule {}
