import { Module } from "@nestjs/common";
import { MetadataSchemaController } from "./schema.controller";
import { MetadataSchemaService } from "./schema.service";

@Module({ controllers: [MetadataSchemaController], providers: [MetadataSchemaService], exports: [MetadataSchemaService] })
export class MetadataSchemaModule {}