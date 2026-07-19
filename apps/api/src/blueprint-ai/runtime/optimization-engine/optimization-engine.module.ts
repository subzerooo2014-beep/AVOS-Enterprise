import { Module } from "@nestjs/common";
import { OptimizationEngineService } from "./optimization-engine.service";
import { OptimizationEngineController } from "./optimization-engine.controller";

@Module({
 providers:[OptimizationEngineService],
 controllers:[OptimizationEngineController],
 exports:[OptimizationEngineService]
})
export class OptimizationEngineModule{}
