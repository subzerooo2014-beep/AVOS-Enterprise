import { Module } from "@nestjs/common";
import { KnowledgeTrustController } from "./trust.controller";
import { KnowledgeTrustService } from "./trust.service";

@Module({ controllers: [KnowledgeTrustController], providers: [KnowledgeTrustService], exports: [KnowledgeTrustService] })
export class KnowledgeTrustModule {}