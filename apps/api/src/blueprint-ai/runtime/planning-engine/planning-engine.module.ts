import { Module } from "@nestjs/common";
import { PlanningEngineService } from "./planning-engine.service";
import { PlanningEngineController } from "./planning-engine.controller";

@Module({
 providers:[PlanningEngineService],
 controllers:[PlanningEngineController],
 exports:[PlanningEngineService]
})
export class PlanningEngineModule{}
