
import { Module } from "@nestjs/common";
import { AutonomousOrchestrationController } from "./autonomous-orchestration.controller";
import { AutonomousOrchestrationService } from "./services/autonomous-orchestration.service";
@Module({controllers:[AutonomousOrchestrationController],providers:[AutonomousOrchestrationService],exports:[AutonomousOrchestrationService]})
export class AutonomousOrchestrationModule{}