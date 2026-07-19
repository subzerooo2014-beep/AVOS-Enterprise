import { Module } from "@nestjs/common";
import { RepositoryGeneratorService } from "./repository-generator.service";
import { RepositoryGeneratorController } from "./repository-generator.controller";

@Module({
 providers:[RepositoryGeneratorService],
 controllers:[RepositoryGeneratorController]
})
export class RepositoryGeneratorModule{}
