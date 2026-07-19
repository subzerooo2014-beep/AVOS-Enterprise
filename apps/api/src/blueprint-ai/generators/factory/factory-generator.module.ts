import { Module } from "@nestjs/common";
import { FactoryGeneratorService } from "./factory-generator.service";
import { FactoryGeneratorController } from "./factory-generator.controller";

@Module({
 providers:[FactoryGeneratorService],
 controllers:[FactoryGeneratorController]
})
export class FactoryGeneratorModule{}
