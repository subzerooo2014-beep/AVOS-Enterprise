import { Module } from "@nestjs/common";
import { VersionEngineService } from "./version-engine.service";
import { VersionEngineController } from "./version-engine.controller";

@Module({
 providers:[VersionEngineService],
 controllers:[VersionEngineController],
 exports:[VersionEngineService]
})
export class VersionEngineModule{}
