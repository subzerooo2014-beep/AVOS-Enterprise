import { Module } from "@nestjs/common";
import { MetadataRelationshipController } from "./relationship.controller";
import { MetadataRelationshipService } from "./relationship.service";

@Module({ controllers: [MetadataRelationshipController], providers: [MetadataRelationshipService], exports: [MetadataRelationshipService] })
export class MetadataRelationshipModule {}