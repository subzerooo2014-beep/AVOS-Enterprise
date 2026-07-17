import { Module } from "@nestjs/common";
import { MemorySecurityController } from "./security.controller";
import { MemorySecurityService } from "./security.service";

@Module({ controllers: [MemorySecurityController], providers: [MemorySecurityService], exports: [MemorySecurityService] })
export class MemorySecurityModule {}