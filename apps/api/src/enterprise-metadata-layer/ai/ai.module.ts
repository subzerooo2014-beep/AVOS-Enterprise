import { Module } from "@nestjs/common";
import { MetadataAiController } from "./ai.controller";
import { MetadataAiService } from "./ai.service";

@Module({ controllers: [MetadataAiController], providers: [MetadataAiService], exports: [MetadataAiService] })
export class MetadataAiModule {}