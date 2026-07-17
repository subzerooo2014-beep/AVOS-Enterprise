import { Module } from "@nestjs/common";
import { MemoryFederationController } from "./federation.controller";
import { MemoryFederationService } from "./federation.service";

@Module({ controllers: [MemoryFederationController], providers: [MemoryFederationService], exports: [MemoryFederationService] })
export class MemoryFederationModule {}