import { Module } from "@nestjs/common";
import { MetadataCatalogController } from "./catalog.controller";
import { MetadataCatalogService } from "./catalog.service";

@Module({ controllers: [MetadataCatalogController], providers: [MetadataCatalogService], exports: [MetadataCatalogService] })
export class MetadataCatalogModule {}