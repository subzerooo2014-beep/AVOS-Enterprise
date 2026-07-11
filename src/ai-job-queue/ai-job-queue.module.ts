import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "../prisma/prisma.module";
import { AiJobQueueController } from "./ai-job-queue.controller";
import { AiJobQueueService } from "./ai-job-queue.service";
import { AiJobWorkerService } from "./ai-job-worker.service";

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AiJobQueueController,
  ],
  providers: [
    AiJobQueueService,
    AiJobWorkerService,
  ],
  exports: [
    AiJobQueueService,
  ],
})
export class AiJobQueueModule {}
