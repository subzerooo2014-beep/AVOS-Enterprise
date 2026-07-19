import { Module } from "@nestjs/common";
import { FixtureGeneratorService } from "./fixture-generator.service";
import { FixtureGeneratorController } from "./fixture-generator.controller";

@Module({
 providers:[FixtureGeneratorService],
 controllers:[FixtureGeneratorController]
})
export class FixtureGeneratorModule{}
