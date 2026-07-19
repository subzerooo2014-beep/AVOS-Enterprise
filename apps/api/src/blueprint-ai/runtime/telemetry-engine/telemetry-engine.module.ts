import { Module } from "@nestjs/common";
import { TelemetryEngineService } from "./telemetry-engine.service";
import { TelemetryEngineController } from "./telemetry-engine.controller";

@Module({
 providers:[TelemetryEngineService],
 controllers:[TelemetryEngineController],
 exports:[TelemetryEngineService]
})
export class TelemetryEngineModule{}
