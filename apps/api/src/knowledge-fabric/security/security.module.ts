import { Module } from "@nestjs/common";
import { KnowledgeSecurityController } from "./security.controller";
import { KnowledgeSecurityService } from "./security.service";

@Module({ controllers: [KnowledgeSecurityController], providers: [KnowledgeSecurityService], exports: [KnowledgeSecurityService] })
export class KnowledgeSecurityModule {}