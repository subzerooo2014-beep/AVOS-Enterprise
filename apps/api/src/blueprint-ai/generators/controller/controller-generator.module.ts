import { Module } from "@nestjs/common";
import { ControllerGeneratorService } from "./controller-generator.service";
import { ControllerGeneratorController } from "./controller-generator.controller";

@Module({
 providers:[ControllerGeneratorService],
 controllers:[ControllerGeneratorController]
})
export class ControllerGeneratorModule{}
