import { Module } from "@nestjs/common";
import { MemoryCertificationController } from "./certification.controller";
import { MemoryCertificationService } from "./certification.service";

@Module({ controllers: [MemoryCertificationController], providers: [MemoryCertificationService], exports: [MemoryCertificationService] })
export class MemoryCertificationModule {}