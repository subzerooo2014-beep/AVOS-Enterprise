import { Module } from "@nestjs/common";
import { ModuleGeneratorService } from "./module-generator.service";
import { ModuleGeneratorController } from "./module-generator.controller";

@Module({
 providers:[ModuleGeneratorService],
 controllers:[ModuleGeneratorController]
})
export class ModuleGeneratorModule{}
