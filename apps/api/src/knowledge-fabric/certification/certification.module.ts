import { Module } from "@nestjs/common";
import { KnowledgeFabricCertificationController } from "./certification.controller";
import { KnowledgeFabricCertificationService } from "./certification.service";

@Module({ controllers: [KnowledgeFabricCertificationController], providers: [KnowledgeFabricCertificationService], exports: [KnowledgeFabricCertificationService] })
export class KnowledgeFabricCertificationModule {}