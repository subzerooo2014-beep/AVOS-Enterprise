import { Module } from "@nestjs/common";
import { CodeFactoryPersistenceController } from "./code-factory-persistence.controller";
import { AtomicFileWriterService } from "./infrastructure/atomic-file-writer.service";
import { HashService } from "./infrastructure/hash.service";
import { PathSafetyService } from "./infrastructure/path-safety.service";
import { PersistentFactoryRepository } from "./repositories/persistent-factory.repository";
import { ArtifactMaterializationService } from "./services/artifact-materialization.service";
import { AuditTraceService } from "./services/audit-trace.service";
import { AutoRecoveryBootstrapService } from "./services/auto-recovery-bootstrap.service";
import { AutonomousRunHistoryService } from "./services/autonomous-run-history.service";
import { CheckpointService } from "./services/checkpoint.service";
import { PackageRegistryService } from "./services/package-registry.service";
import { PersistenceCertificationService } from "./services/persistence-certification.service";
import { PersistenceSmokeService } from "./services/persistence-smoke.service";
import { PersistenceVerificationService } from "./services/persistence-verification.service";
import { SnapshotManagerService } from "./services/snapshot-manager.service";
import { SynchronizationService } from "./services/synchronization.service";
import { WorkspaceHealthService } from "./services/workspace-health.service";
import { WorkspacePersistenceService } from "./services/workspace-persistence.service";
import { WorkspaceRecoveryService } from "./services/workspace-recovery.service";

@Module({
  controllers: [CodeFactoryPersistenceController],
  providers: [
    AtomicFileWriterService,
    HashService,
    PathSafetyService,
    PersistentFactoryRepository,
    AuditTraceService,
    WorkspacePersistenceService,
    ArtifactMaterializationService,
    SnapshotManagerService,
    CheckpointService,
    WorkspaceRecoveryService,
    SynchronizationService,
    AutonomousRunHistoryService,
    PackageRegistryService,
    WorkspaceHealthService,
    PersistenceVerificationService,
    PersistenceSmokeService,
    PersistenceCertificationService,
    AutoRecoveryBootstrapService
  ],
  exports: [
    PersistentFactoryRepository,
    WorkspacePersistenceService,
    ArtifactMaterializationService,
    SnapshotManagerService,
    CheckpointService,
    WorkspaceRecoveryService,
    SynchronizationService,
    AutonomousRunHistoryService,
    PackageRegistryService,
    WorkspaceHealthService,
    PersistenceVerificationService,
    PersistenceCertificationService
  ]
})
export class CodeFactoryMegaPack4Module {}