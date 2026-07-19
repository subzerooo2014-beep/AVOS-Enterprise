import { Module } from "@nestjs/common";
import { JsonFileStoreService } from "./infrastructure/json-file-store.service";
import { DurableJobQueueService } from "./mp5/durable-job-queue.service";
import { DistributedWorkerService } from "./mp5/distributed-worker.service";
import { UniversalGenerationService } from "./mp6/universal-generation.service";
import { AutonomousSoftwareArchitectService } from "./mp7/autonomous-software-architect.service";
import { UltimateVerificationService } from "./mp8/ultimate-verification.service";
import { UltimateSmokeService } from "./mp8/ultimate-smoke.service";
import { UltimateCertificationService } from "./mp8/ultimate-certification.service";
import { UltimateStatusService } from "./ultimate-status.service";
import { CodeFactoryUltimateController } from "./code-factory-ultimate.controller";
@Module({controllers:[CodeFactoryUltimateController],providers:[JsonFileStoreService,DurableJobQueueService,DistributedWorkerService,UniversalGenerationService,AutonomousSoftwareArchitectService,UltimateVerificationService,UltimateSmokeService,UltimateCertificationService,UltimateStatusService],exports:[DurableJobQueueService,UniversalGenerationService,AutonomousSoftwareArchitectService,UltimateCertificationService]})
export class CodeFactoryUltimateModule {}
