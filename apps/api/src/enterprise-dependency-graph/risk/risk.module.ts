import { Module } from "@nestjs/common";
import { DependencyRiskController } from "./risk.controller";
import { DependencyRiskService } from "./risk.service";

@Module({ controllers: [DependencyRiskController], providers: [DependencyRiskService], exports: [DependencyRiskService] })
export class DependencyRiskModule {}