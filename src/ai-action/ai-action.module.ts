import { Module } from "@nestjs/common";
import { AiDecisionModule } from "../ai-decision/ai-decision.module";
import { AiActionLogModule } from "../ai-action-log/ai-action-log.module";
import { PublishJobsModule } from "../publish-jobs/publish-jobs.module";
import { AiActionController } from "./ai-action.controller";
import { AiActionService } from "./ai-action.service";

@Module({
  imports: [
    AiDecisionModule,
    AiActionLogModule,
    PublishJobsModule,
  ],
  controllers: [
    AiActionController,
  ],
  providers: [
    AiActionService,
  ],
})
export class AiActionModule {}
