import { Module } from "@nestjs/common";
import { MetadataRegistryController } from "./registry.controller";
import { MetadataRegistryService } from "./registry.service";

@Module({ controllers: [MetadataRegistryController], providers: [MetadataRegistryService], exports: [MetadataRegistryService] })
export class MetadataRegistryModule {}