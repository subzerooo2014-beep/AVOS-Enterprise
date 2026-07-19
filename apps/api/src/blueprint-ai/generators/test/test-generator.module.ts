import { Module } from "@nestjs/common";
import { TestGeneratorService } from "./test-generator.service";
import { TestGeneratorController } from "./test-generator.controller";

@Module({
 providers:[TestGeneratorService],
 controllers:[TestGeneratorController]
})
export class TestGeneratorModule{}
