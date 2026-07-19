import { Module } from "@nestjs/common";
import { IntegrationEngineService } from "./integration-engine.service";
import { IntegrationEngineController } from "./integration-engine.controller";

@Module({
 providers:[IntegrationEngineService],
 controllers:[IntegrationEngineController],
 exports:[IntegrationEngineService]
})
export class IntegrationEngineModule{}
