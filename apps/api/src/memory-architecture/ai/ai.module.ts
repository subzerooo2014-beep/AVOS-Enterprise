import { Module } from "@nestjs/common";
import { MemoryAiController } from "./ai.controller";
import { MemoryAiService } from "./ai.service";

@Module({ controllers: [MemoryAiController], providers: [MemoryAiService], exports: [MemoryAiService] })
export class MemoryAiModule {}