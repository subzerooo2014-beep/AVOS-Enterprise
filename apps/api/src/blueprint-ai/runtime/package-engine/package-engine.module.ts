import { Module } from "@nestjs/common";
import { PackageEngineService } from "./package-engine.service";
import { PackageEngineController } from "./package-engine.controller";

@Module({
 providers:[PackageEngineService],
 controllers:[PackageEngineController],
 exports:[PackageEngineService]
})
export class PackageEngineModule{}
