import { Module } from "@nestjs/common";
import { MetricsEngineService } from "./metrics-engine.service";
import { MetricsEngineController } from "./metrics-engine.controller";

@Module({
 providers:[MetricsEngineService],
 controllers:[MetricsEngineController],
 exports:[MetricsEngineService]
})
export class MetricsEngineModule{}
