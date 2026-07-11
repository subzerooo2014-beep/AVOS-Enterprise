import { GovernanceArchiveType, GovernanceDataClassification, GovernanceEnvironment } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateGovernanceArchiveDto {
    type: GovernanceArchiveType;
    name: string;
    description?: string;
    classification: GovernanceDataClassification;
    environment?: GovernanceEnvironment;
    namespace?: string;
    sourceResourceIds?: string[];
    checkpointId?: string;
    compressed: boolean;
    encrypted: boolean;
    immutable: boolean;
    retentionPolicyId?: string;
    expiresAt?: string;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
