import { Module } from "@nestjs/common";
import { MemoryFoundationController } from "./foundation.controller";
import { MemoryFoundationService } from "./foundation.service";

@Module({ controllers: [MemoryFoundationController], providers: [MemoryFoundationService], exports: [MemoryFoundationService] })
export class MemoryFoundationModule {}