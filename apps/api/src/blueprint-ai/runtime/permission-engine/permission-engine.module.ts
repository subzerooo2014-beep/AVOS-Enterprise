import { Module } from "@nestjs/common";
import { PermissionEngineService } from "./permission-engine.service";
import { PermissionEngineController } from "./permission-engine.controller";

@Module({
 providers:[PermissionEngineService],
 controllers:[PermissionEngineController],
 exports:[PermissionEngineService]
})
export class PermissionEngineModule{}
