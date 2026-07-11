import { GovernanceArchiveType, GovernanceDataClassification, GovernanceEnvironment } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateGovernanceRetentionPolicyDto {
    key: string;
    name: string;
    description?: string;
    archiveTypes: GovernanceArchiveType[];
    classifications: GovernanceDataClassification[];
    retentionDays: number;
    archiveAfterDays?: number;
    compressAfterDays?: number;
    redactAfterDays?: number;
    deleteAfterDays?: number;
    legalHold: boolean;
    immutable: boolean;
    environment?: GovernanceEnvironment;
    namespace?: string;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
