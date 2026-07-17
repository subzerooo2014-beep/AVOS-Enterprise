import { Module } from "@nestjs/common";
import { KnowledgeCapitalController } from "./capital.controller";
import { KnowledgeCapitalService } from "./capital.service";

@Module({ controllers: [KnowledgeCapitalController], providers: [KnowledgeCapitalService], exports: [KnowledgeCapitalService] })
export class KnowledgeCapitalModule {}