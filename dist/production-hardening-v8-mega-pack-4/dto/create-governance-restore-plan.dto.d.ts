import { GovernanceEnvironment, GovernanceSnapshotScope } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateGovernanceRestorePlanDto {
    name: string;
    description?: string;
    archiveId?: string;
    checkpointId?: string;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    targetScope: GovernanceSnapshotScope;
    dryRun: boolean;
    restoreSections?: string[];
    conflictStrategy: "fail" | "overwrite" | "merge" | "skip_existing";
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
