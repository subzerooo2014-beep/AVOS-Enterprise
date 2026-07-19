import { Module } from "@nestjs/common";
import { DtoGeneratorService } from "./dto-generator.service";
import { DtoGeneratorController } from "./dto-generator.controller";

@Module({
 providers:[DtoGeneratorService],
 controllers:[DtoGeneratorController]
})
export class DtoGeneratorModule{}
