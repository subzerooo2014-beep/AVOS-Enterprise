import { Module } from "@nestjs/common";
import { MemoryEvolutionController } from "./evolution.controller";
import { MemoryEvolutionService } from "./evolution.service";

@Module({ controllers: [MemoryEvolutionController], providers: [MemoryEvolutionService], exports: [MemoryEvolutionService] })
export class MemoryEvolutionModule {}