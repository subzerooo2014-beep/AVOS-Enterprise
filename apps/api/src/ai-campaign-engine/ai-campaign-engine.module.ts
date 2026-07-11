import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AiDecisionModule } from "../ai-decision/ai-decision.module";
import { PublishJobsModule } from "../publish-jobs/publish-jobs.module";
import { AiActionLogModule } from "../ai-action-log/ai-action-log.module";
import { AiCampaignEngineController } from "./ai-campaign-engine.controller";
import { AiCampaignEngineService } from "./ai-campaign-engine.service";

@Module({
  imports: [
    PrismaModule,
    AiDecisionModule,
    PublishJobsModule,
    AiActionLogModule,
  ],
  controllers: [
    AiCampaignEngineController,
  ],
  providers: [
    AiCampaignEngineService,
  ],
  exports: [
    AiCampaignEngineService,
  ],
})
export class AiCampaignEngineModule {}
