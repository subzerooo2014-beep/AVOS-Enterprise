import { Module } from "@nestjs/common";
import { MigrationGeneratorService } from "./migration-generator.service";
import { MigrationGeneratorController } from "./migration-generator.controller";

@Module({
 providers:[MigrationGeneratorService],
 controllers:[MigrationGeneratorController]
})
export class MigrationGeneratorModule{}
