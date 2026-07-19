import { Module } from "@nestjs/common";
import { BuildRunnerService } from "./build-runner.service";
import { BuildRunnerController } from "./build-runner.controller";

@Module({
  providers:[BuildRunnerService],
  controllers:[BuildRunnerController],
  exports:[BuildRunnerService]
})
export class BuildRunnerModule {}
