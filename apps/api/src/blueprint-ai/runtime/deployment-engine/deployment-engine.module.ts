import { Module } from "@nestjs/common";
import { DeploymentEngineService } from "./deployment-engine.service";
import { DeploymentEngineController } from "./deployment-engine.controller";

@Module({
 providers:[DeploymentEngineService],
 controllers:[DeploymentEngineController],
 exports:[DeploymentEngineService]
})
export class DeploymentEngineModule{}
