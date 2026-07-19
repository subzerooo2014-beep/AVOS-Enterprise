import { Module } from "@nestjs/common";
import { CommandGeneratorService } from "./command-generator.service";
import { CommandGeneratorController } from "./command-generator.controller";

@Module({
 providers:[CommandGeneratorService],
 controllers:[CommandGeneratorController]
})
export class CommandGeneratorModule{}
