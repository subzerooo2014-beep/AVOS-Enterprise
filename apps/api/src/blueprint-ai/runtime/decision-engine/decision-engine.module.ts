import { Module } from "@nestjs/common";
import { DecisionEngineService } from "./decision-engine.service";
import { DecisionEngineController } from "./decision-engine.controller";

@Module({
 providers:[DecisionEngineService],
 controllers:[DecisionEngineController],
 exports:[DecisionEngineService]
})
export class DecisionEngineModule{}
