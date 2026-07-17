import { Module } from "@nestjs/common";
import { KnowledgeIntelligencePlatformController } from "./platform.controller";
import { KnowledgeIntelligencePlatformService } from "./platform.service";

@Module({ controllers: [KnowledgeIntelligencePlatformController], providers: [KnowledgeIntelligencePlatformService], exports: [KnowledgeIntelligencePlatformService] })
export class KnowledgeIntelligencePlatformModule {}