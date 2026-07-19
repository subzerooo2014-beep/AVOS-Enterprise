import { Module } from "@nestjs/common";
import { SeedGeneratorService } from "./seed-generator.service";
import { SeedGeneratorController } from "./seed-generator.controller";

@Module({
 providers:[SeedGeneratorService],
 controllers:[SeedGeneratorController]
})
export class SeedGeneratorModule{}
