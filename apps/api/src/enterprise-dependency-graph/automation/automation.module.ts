import { Module } from "@nestjs/common";
import { DependencyAutomationController } from "./automation.controller";
import { DependencyAutomationService } from "./automation.service";

@Module({ controllers: [DependencyAutomationController], providers: [DependencyAutomationService], exports: [DependencyAutomationService] })
export class DependencyAutomationModule {}