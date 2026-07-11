import { Module } from "@nestjs/common";
import { AiRuntimeModule } from "../ai-runtime/ai-runtime.module";
import { AvosBrainController } from "./avos-brain.controller";
import { AvosBrainService } from "./avos-brain.service";

@Module({
  imports: [AiRuntimeModule],
  controllers: [AvosBrainController],
  providers: [AvosBrainService],
  exports: [AvosBrainService],
})
export class AvosBrainModule {}
