import { Module } from "@nestjs/common";
import { ReasoningEngineService } from "./reasoning-engine.service";
import { ReasoningEngineController } from "./reasoning-engine.controller";

@Module({
 providers:[ReasoningEngineService],
 controllers:[ReasoningEngineController],
 exports:[ReasoningEngineService]
})
export class ReasoningEngineModule{}
