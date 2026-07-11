import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AiResultsModule } from "../ai-results/ai-results.module";
import { AiDecisionHistoryModule } from "../ai-decision-history/ai-decision-history.module";
import { AiDecisionController } from "./ai-decision.controller";
import { AiDecisionService } from "./ai-decision.service";

@Module({
  imports: [
    PrismaModule,
    AiResultsModule,
    AiDecisionHistoryModule,
  ],
  controllers: [
    AiDecisionController,
  ],
  providers: [
    AiDecisionService,
  ],
  exports: [
    AiDecisionService,
  ],
})
export class AiDecisionModule {}
