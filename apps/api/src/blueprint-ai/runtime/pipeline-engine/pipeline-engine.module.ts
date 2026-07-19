import { Module } from "@nestjs/common";
import { PipelineEngineService } from "./pipeline-engine.service";
import { PipelineEngineController } from "./pipeline-engine.controller";

@Module({
 providers:[PipelineEngineService],
 controllers:[PipelineEngineController],
 exports:[PipelineEngineService]
})
export class PipelineEngineModule{}
