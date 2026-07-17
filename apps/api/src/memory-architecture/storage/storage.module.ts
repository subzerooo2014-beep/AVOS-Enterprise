import { Module } from "@nestjs/common";
import { MemoryStorageController } from "./storage.controller";
import { MemoryStorageService } from "./storage.service";

@Module({ controllers: [MemoryStorageController], providers: [MemoryStorageService], exports: [MemoryStorageService] })
export class MemoryStorageModule {}