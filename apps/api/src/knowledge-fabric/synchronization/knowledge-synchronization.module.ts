import { Module } from "@nestjs/common";
import { KnowledgeSyncCheckpointStoreService } from "./knowledge-sync-checkpoint-store.service";
import { KnowledgeSyncConflictDetectorService } from "./knowledge-sync-conflict-detector.service";
import { KnowledgeSyncPlannerService } from "./knowledge-sync-planner.service";
import { KnowledgeSyncCompatibilityService } from "./knowledge-sync-compatibility.service";
import { KnowledgeSyncMergeService } from "./knowledge-sync-merge.service";
import { KnowledgeSyncRecoveryService } from "./knowledge-sync-recovery.service";
import { KnowledgeSyncEventService } from "./knowledge-sync-event.service";
import { KnowledgeSynchronizationEngineService } from "./knowledge-synchronization-engine.service";
import { KnowledgeSynchronizationHealthService } from "./knowledge-synchronization-health.service";
import { KnowledgeSynchronizationController } from "./knowledge-synchronization.controller";
@Module({controllers:[KnowledgeSynchronizationController],providers:[KnowledgeSyncCheckpointStoreService,KnowledgeSyncConflictDetectorService,KnowledgeSyncPlannerService,KnowledgeSyncCompatibilityService,KnowledgeSyncMergeService,KnowledgeSyncRecoveryService,KnowledgeSyncEventService,KnowledgeSynchronizationEngineService,KnowledgeSynchronizationHealthService],exports:[KnowledgeSyncCheckpointStoreService,KnowledgeSyncConflictDetectorService,KnowledgeSyncPlannerService,KnowledgeSyncCompatibilityService,KnowledgeSyncMergeService,KnowledgeSyncRecoveryService,KnowledgeSyncEventService,KnowledgeSynchronizationEngineService,KnowledgeSynchronizationHealthService]})
export class KnowledgeSynchronizationModule {}