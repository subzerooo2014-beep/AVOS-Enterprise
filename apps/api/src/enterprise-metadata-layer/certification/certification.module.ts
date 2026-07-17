import { Module } from "@nestjs/common";
import { MetadataCertificationController } from "./certification.controller";
import { MetadataCertificationService } from "./certification.service";

@Module({ controllers: [MetadataCertificationController], providers: [MetadataCertificationService], exports: [MetadataCertificationService] })
export class MetadataCertificationModule {}