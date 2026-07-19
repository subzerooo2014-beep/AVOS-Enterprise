import { Module } from "@nestjs/common";
import { EntityGeneratorService } from "./entity-generator.service";
import { EntityGeneratorController } from "./entity-generator.controller";

@Module({
 providers:[EntityGeneratorService],
 controllers:[EntityGeneratorController]
})
export class EntityGeneratorModule{}
