import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AiActionLogModule } from "../ai-action-log/ai-action-log.module";
import { AiDistributionEngineController } from "./ai-distribution-engine.controller";
import { AiDistributionEngineService } from "./ai-distribution-engine.service";

@Module({
  imports: [
    PrismaModule,
    AiActionLogModule,
  ],
  controllers: [
    AiDistributionEngineController,
  ],
  providers: [
    AiDistributionEngineService,
  ],
  exports: [
    AiDistributionEngineService,
  ],
})
export class AiDistributionEngineModule {}
