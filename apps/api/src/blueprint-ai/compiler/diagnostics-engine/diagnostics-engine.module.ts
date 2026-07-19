import { Module } from "@nestjs/common";
import { DiagnosticsEngineService } from "./diagnostics-engine.service";
import { DiagnosticsEngineController } from "./diagnostics-engine.controller";

@Module({
  providers:[DiagnosticsEngineService],
  controllers:[DiagnosticsEngineController],
  exports:[DiagnosticsEngineService]
})
export class DiagnosticsEngineModule {}
