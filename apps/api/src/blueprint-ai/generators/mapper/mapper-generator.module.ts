import { Module } from "@nestjs/common";
import { MapperGeneratorService } from "./mapper-generator.service";
import { MapperGeneratorController } from "./mapper-generator.controller";

@Module({
 providers:[MapperGeneratorService],
 controllers:[MapperGeneratorController]
})
export class MapperGeneratorModule{}
