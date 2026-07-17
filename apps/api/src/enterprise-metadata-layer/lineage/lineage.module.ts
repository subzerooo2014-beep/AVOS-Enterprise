import { Module } from "@nestjs/common";
import { MetadataLineageController } from "./lineage.controller";
import { MetadataLineageService } from "./lineage.service";

@Module({ controllers: [MetadataLineageController], providers: [MetadataLineageService], exports: [MetadataLineageService] })
export class MetadataLineageModule {}