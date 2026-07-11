import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { AvosBrainModule } from "../avos-brain/avos-brain.module";
import { AiWorkerService } from "./ai-worker.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AvosBrainModule,
  ],
  providers: [
    AiWorkerService,
  ],
})
export class AvosRuntimeModule {}
