import { Module } from "@nestjs/common";
import { DependencyCertificationController } from "./certification.controller";
import { DependencyCertificationService } from "./certification.service";

@Module({ controllers: [DependencyCertificationController], providers: [DependencyCertificationService], exports: [DependencyCertificationService] })
export class DependencyCertificationModule {}