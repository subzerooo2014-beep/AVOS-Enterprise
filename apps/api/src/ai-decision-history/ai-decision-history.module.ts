import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AiDecisionHistoryController } from "./ai-decision-history.controller";
import { AiDecisionHistoryService } from "./ai-decision-history.service";

@Module({
  imports: [PrismaModule],
  controllers: [AiDecisionHistoryController],
  providers: [AiDecisionHistoryService],
  exports: [AiDecisionHistoryService],
})
export class AiDecisionHistoryModule {}
